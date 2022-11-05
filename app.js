const vue = new Vue({
  el: "#app",
  data: {
    produtos: {},
    produto: false,
    carrinho: [],
    mensagem_alerta: "",
    alertMessage: false,
    carrinhoAtivo: false,
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
    toUpper(valor) {
      return valor.toUpperCase();
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then((response) => response.json())
        .then((response) => {
          this.produtos = response;
        });
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((response) => response.json())
        .then((response) => {
          this.produto = response;
        });
    },
    fecharModal(event) {
      if (event.target == event.currentTarget) {
        this.produto = false;
      }
    },
    fecharModalCarrinho(event) {
      if (event.target == event.currentTarget) {
        this.carrinhoAtivo = false;
      }
    },
    adicionarItem() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.carrinhoTotal += this.produto.preco;
      this.chamarAlerta(`${nome}` + "  adicionado ao carrinho");
    },
    removerItem(index) {
      this.chamarAlerta("Removido do carrinho");
      this.carrinho.splice(index, 1);
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    compararEstoque() {
      const items = this.carrinho.filter(({id}) => id === this.produto.id );
      this.produto.estoque -= items.length
    },
    chamarAlerta(mensagem) {
      this.alertMessage = true;
      this.mensagem_alerta = mensagem;
      setTimeout(() => {
        this.alertMessage = false;
      }, 2500);
    },
    router() {
      const hash = document.location.hash;
      if (hash) {
        this.fetchProduto(hash.replace("#", ""));
      }
    },
  },
  watch: {
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      if (this.produto) {
        this.compararEstoque();
      }
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
  },
  created() {
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  },
});
