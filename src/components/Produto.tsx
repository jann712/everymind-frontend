import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Modal, TextField } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { queryClient } from "../services/queryClient";

type EditProdutoForm = {
  name: string;
  desc: string;
  price: number;
};

type componentProps = {
  id: number;
  name: string;
  desc: string;
  price: number;
};

export default function Produto(props: componentProps) {
  const apiAddress = import.meta.env.VITE_API_ADDRESS
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [price, setPrice] = useState<number>(29.99);
  const { register, handleSubmit, reset } = useForm<EditProdutoForm>();

  // Esse hook deleta um produto após uma confirmação que aparece no modal
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await axios
        .delete(`${apiAddress}/produto/${props.id}`)
        .then((response) => response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      alert("Produto deletado.")
    },
    onError: (error) => {
      console.error(error)
      alert("Algo deu errado.")
    }
  });

  //Esse hook atualiza o produto conforme as modifiçãoes aplicadas nos campos de entrada do formulário do modal
  const { mutate } = useMutation({
    mutationFn: async ({ name, desc, price }: EditProdutoForm) => {
      return await axios
        .put(`${apiAddress}/updateProduto/${props.id}`, {
          name,
          desc,
          price,
        })
        .then((response) => response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      alert("Produto atualizado!");
    },
    onError: (error) => {
      console.error(error);
      alert("Algo deu errado.");
    },
  });

  return (
    <>
      <div className="bg-white p-7 m-3 rounded shadow-lg hover:shadow-blue-100 transition-shadow">
        <span className="text-xs">Código {props.id}</span>
        <div className="flex items-center">
          <span className="text-xl font-medium">{props.name}</span>
          <div className="flex ml-auto gap-3">
            <button onClick={handleOpen} className="items-center flex gap-1">
              <EditOutlinedIcon sx={{ fontSize: "2rem" }} />
            </button>
            <button onClick={handleOpenDelete} className="items-center flex gap-1">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: "2rem" }} />
            </button>
          </div>
        </div>
        <span className="text-sm">{props.desc}</span>
      </div>
      <Modal open={open} onClose={handleClose}>
        <div className="rounded bg-slate-50 absolute m-auto left-0 right-0 top-32 md:top-56 lg:top-44 w-3/4 md:w-2/4 md:h-1/2 lg:w-1/4 h-3/5">
          <div className="flex items-center justify-center h-full">
            <div>
              <h3 className="text-center mb-7 text-md font-medium">
                Editar Produto
              </h3>
              <form
                id="createProductForm"
                action=""
                onSubmit={handleSubmit((values) => {
                  mutate({ ...values, price: Number(values.price) });
                  reset();
                })}
                className="flex flex-col gap-4 mx-7"
              >
                <TextField
                  defaultValue={props.name}
                  {...register("name")}
                  label="Nome"
                  size="small"
                />
                <TextField
                  defaultValue={props.desc}
                  {...register("desc")}
                  label="Descrição"
                  size="small"
                />
                <TextField
                  defaultValue={props.price}
                  {...register("price")}
                  type="number"
                  value={price}
                  onChange={(event) => {
                    setPrice(Number(event.target.value));
                  }}
                  label="Preço"
                  size="small"
                />

                <button className="mt-1 border rounded border-slate-700 bg-slate-600 text-white font-semibold">
                  ENVIAR
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={openDelete} onClose={handleCloseDelete}>
        <div className="rounded bg-slate-50 absolute m-auto left-0 right-0 top-32 md:top-56 lg:top-44 w-3/4 md:w-2/4 md:h-1/2 lg:w-1/4 h-2/5">
          <div className="flex items-center justify-center h-full">
            <div>
              <h3 className="text-center mb-7 text-md font-medium">
                Confirmar deleção de produto?
              </h3>
              <div className="flex">
                <button onClick={() => deleteMutation.mutate()} className="w-full rounded bg-red-200 mx-3">Sim</button>
                <button onClick={handleCloseDelete} className="w-full rounded bg-slate-200 mx-3">Não</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
