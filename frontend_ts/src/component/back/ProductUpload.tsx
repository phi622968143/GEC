import axios from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";

const ProductUpload: React.FC = () => {
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const handleSkillChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSkillLevel(e.target.value);
  };

  const getSkillBackgroundColor = (): string => {
    switch (skillLevel) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-orange-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-white";
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const getCategoryBackgroundColor = (): string => {
    switch (category) {
      case "1":
        return "bg-green-500";
      case "2":
        return "bg-orange-500";
      case "3":
        return "bg-red-500";
      case "4":
        return "bg-blue-500";
      default:
        return "bg-white";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const productData = new FormData();
      productData.append("name", formData.get("name") as string);
      productData.append("price", formData.get("price") as string);
      productData.append("brand", formData.get("brand") as string);
      productData.append("num", formData.get("num") as string);
      productData.append("description", formData.get("description") as string);
      productData.append("skill_lv", formData.get("skill_lv") as string);
      productData.append("category", formData.get("category") as string);

      const productResponse = await axios.post(
        "http://127.0.0.1:8000/api/product/post",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const productId = productResponse.data.id;

      const imageData = new FormData();
      imageData.append("product", productId);
      imageData.append("img", formData.get("img") as File);
      imageData.append("primary", formData.get("primary") ? "true" : "false");

      await axios.post("http://127.0.0.1:8000/api/img/post", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const audioData = new FormData();
      audioData.append("product", productId);
      audioData.append("equipment", formData.get("equipment") as string);
      audioData.append("audio", formData.get("audio") as File);

      await axios.post("http://127.0.0.1:8000/api/audio/post", audioData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("All uploads were successful!");
      window.location.href = "http://localhost:1140/";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file.name);
    }
  };

  return (
    <div className="p-14 bg-zinc-200">
      <div>
        <form
          id="product-form"
          className="border-solid p-3"
          onSubmit={handleSubmit}
        >
          <div className="bg-white shadow-zinc-300 shadow-lg p-5 m-1 rounded border border-zinc-700">
            <h1 className="text-2xl">Upload Product</h1>
          </div>

          <div className="bg-white shadow-zinc-300 shadow-lg p-5 m-1 rounded border border-zinc-700">
            <h2>Product Information</h2>

            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                className="border-solid p-2 rounded border border-zinc-700"
                required
              />
            </div>

            <div>
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                className="border-solid p-2 rounded border border-zinc-700"
                required
              />
            </div>

            <div>
              <label htmlFor="brand">Brand:</label>
              <input
                type="text"
                id="brand"
                name="brand"
                className="border-solid p-2 rounded border border-zinc-700"
                required
              />
            </div>

            <div>
              <label htmlFor="num">Number:</label>
              <input
                type="number"
                id="num"
                name="num"
                className="border-solid p-2 rounded border border-zinc-700"
                required
              />
            </div>

            <div>
              <label>Description (File):</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="hover:file:cursor-pointer block w-1/2 text-sm file:bg-green-500 file:text-white file:px-4 file:py-2 file:rounded file:mt-4 hover:file:bg-green-600"
              />
            </div>

            <div>
              <label htmlFor="skill_lv">Skill Level:</label>
              <select
                id="skill_lv"
                name="skill_lv"
                required
                value={skillLevel}
                onChange={handleSkillChange}
                className={`border-solid p-2 rounded border border-zinc-700 text-white ${getSkillBackgroundColor()}`}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                required
                value={category}
                onChange={handleCategoryChange}
                className={`border-solid p-2 rounded border border-zinc-700 text-white ${getCategoryBackgroundColor()}`}
              >
                <option value="1">Electric Guitar</option>
                <option value="2">Amplifier</option>
                <option value="3">Effects Pedal</option>
                <option value="4">Gig Bag</option>
              </select>
            </div>
          </div>

          <div className="bg-white shadow-zinc-300 shadow-lg p-5 m-1 rounded border border-zinc-700">
            <h2>Upload Product Image</h2>
            <div>
              <label htmlFor="img">Image (File):</label>
              <input
                type="file"
                id="img"
                name="img"
                className="hover:file:cursor-pointer block w-1/2 text-sm file:bg-green-500 file:text-white file:px-4 file:py-2 file:rounded file:mt-4 hover:file:bg-green-600"
                required
              />
            </div>

            <div>
              <label htmlFor="primary">Primary Image:</label>
              <input type="checkbox" id="primary" name="primary" />
            </div>
          </div>

          <div className="bg-white shadow-zinc-300 shadow-lg p-5 m-1 rounded border border-zinc-700">
            <h2>Upload Product Audio</h2>
            <div>
              <label htmlFor="equipment">Equipment:</label>
              <input
                type="text"
                id="equipment"
                name="equipment"
                className="border-solid p-2 rounded border border-zinc-700"
              />
            </div>

            <div>
              <label htmlFor="audio">Audio (File):</label>
              <input
                type="file"
                id="audio"
                name="audio"
                className="hover:file:cursor-pointer block w-1/2 text-sm file:bg-green-500 file:text-white file:px-4 file:py-2 file:rounded file:mt-4 hover:file:bg-green-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;
