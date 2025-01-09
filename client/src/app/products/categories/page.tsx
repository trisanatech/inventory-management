"use client";

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, Edit2Icon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateCategoryModal from "./CreateCategoryModal";

type CategoryFormData = {
  id?: string;
  name: string;
  description?: string;
};

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormData | null>(null);

  const { data: categories, isLoading, isError } = useGetCategoriesQuery(searchTerm);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const handleSubmitCategory = async (categoryData: CategoryFormData) => {
    if (selectedCategory){
      await updateCategory(categoryData)
    }else{
      await createCategory(categoryData);
    }
    console.log(categoryData);
    setIsModalOpen(false);
  };

  const handleCategoryDelete= async (id:number) =>{
    await deleteCategory(id)
  }

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !categories) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch categories
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Categories" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() =>{ setSelectedCategory(null),setIsModalOpen(true)}}
          
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Category
        </button>
      </div>

      {/* BODY CATEGORIES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {category.name}
              </h3>
              <p className="text-gray-800">
                {category.description || "No description"}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center"
                onClick={() =>  {setSelectedCategory(category), setIsModalOpen(true)}}
              >
                <Edit2Icon className="w-4 h-4 mr-2" /> Edit
              </button>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 flex items-center"
                onClick={() => handleCategoryDelete(category.id)}
              >
                <Edit2Icon className="w-4 h-4 mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleSubmitCategory}
        initialData={selectedCategory} 
      />

    </div>
  );
};

export default Categories;
