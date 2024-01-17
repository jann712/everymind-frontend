import { Modal, TextField } from "@mui/material";
import { useState } from "react";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";

type EditProdutoForm = {
  id: number;
  name: string;
  desc: string;
  price: number;
};

function EditProductModal() {
  const apiAddress = import.meta.env.VITE_API_ADDRESS
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [price, setPrice] = useState<number>(29.99);
  const { register, handleSubmit, reset } = useForm<EditProdutoForm>();
  const { mutate } = useMutation({
    mutationFn: async ({  name, desc, price }: EditProdutoForm) => {
      return await axios
        .put(`${apiAddress}updateProduto`, { name, desc, price })
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      console.log({ data });
      alert("Novo produto criado!");
    },
    onError: (error) => {
      console.error(error);
      alert("Algo deu errado.");
    },
  });

  return (
    <>
      <div className="flex justify-center my-3">
        <button onClick={handleOpen} className="items-center flex gap-1">
          <PostAddOutlinedIcon sx={{ fontSize: "2rem" }} />
          <span className="text-base font-medium">Adicionar novo produto</span>
        </button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <div className="rounded bg-slate-50 absolute m-auto left-0 right-0 top-32 w-3/4 h-3/5">
          <div className="flex items-center justify-center h-full">
            <div>
              <h3 className="text-center mb-7 text-md font-medium">
                Novo Produto
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
                <TextField {...register("name")} label="Nome" size="small" />
                <TextField
                  {...register("desc")}
                  label="Descrição"
                  size="small"
                />
                <TextField
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
    </>
  );
}

export default EditProductModal;
