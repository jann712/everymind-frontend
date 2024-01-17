import { useQuery } from "@tanstack/react-query";
import Produto from "../components/Produto";
import axios from "axios";

export type ProdutoModel = {
  id: number;
  name: string;
  desc: string;
  price: number;
};



export function AllProdutos() {
  const apiAddress = import.meta.env.VITE_API_ADDRESS

  // Esse hook lê todos os produtos disponíveis no banco de dados através de uma requisição GET
  const { data, isFetching, isError, error } = useQuery<ProdutoModel[]>({
    queryKey: ["getAllProdutos"],
    queryFn: async () => {
      const response = await axios.get(`${apiAddress}/produtos`);
      return response.data;
    },
    staleTime: 1000 * 20 // 20 segundos
  });

  return (
    <div>
      {isFetching && (
        <div className="text-center m-2">
          <span>Carregando...</span>
        </div>
      )}
      {isError && (
        <div>
          <span>{JSON.stringify(error)}</span>
        </div>
      )}
      {data?.map((produto) => {
        return <Produto key={produto.id} {...produto} />;
      })}
    </div>
  );
}
