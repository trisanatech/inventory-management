import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type CategoryFormData = {
  id: string;
  name: string;
  description: string;
};

type CreateCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CategoryFormData) => void;
  initialData?: CategoryFormData;  
};

const CreateCategoryModal = ({
  isOpen,
  onClose,
  onCreate,
  initialData,
}: CreateCategoryModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    id: v4(),
    name: "",
    description: "",
  });

  useEffect(()=> {
    if(initialData){
      setFormData({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
      })
    }else{
        setFormData({
          id: v4(),
          name: "",
          description: "",
        })
      }
    },[isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Category" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* CATEGORY NAME */}
          <label htmlFor="categoryName" className={labelCssStyles}>
            Category Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* DESCRIPTION */}
          <label htmlFor="categoryDescription" className={labelCssStyles}>
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
            className={`${inputCssStyles} h-24`}
            required
          />

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {initialData ? "Update" : "Create"}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
