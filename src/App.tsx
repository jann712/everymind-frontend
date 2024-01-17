import Navbar from "./components/Navbar";
// import Produto from "./components/Produto";
import { AllProdutos } from "./repository/databaseFetch";
import NewProductModal from "./components/NewProductModal";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <Navbar />
        <div className="text-center mt-5">
          <p>Produtos Disponíveis</p>
        </div>
        <AllProdutos />
        <NewProductModal />
      </div>
    </QueryClientProvider>
  );
}

export default App;
