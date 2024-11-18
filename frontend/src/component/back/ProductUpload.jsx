import axios from "axios";
import React, { useState } from "react";

export const ProductUpload = () => {
  const [skillLevel, setSkillLevel] = useState("");
  const [category, setCategory] = useState("");

  const handleSkillChange = (e) => {
    setSkillLevel(e.target.value);
  };

  // Function to determine background color based on the selected skill level
  const getSkillBackgroundColor = () => {
    switch (skillLevel) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-orange-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-white"; // Default background color
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Function to determine background color based on the selected category
  const getCategoryBackgroundColor = () => {
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
        return "bg-white"; // Default background color
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target); // Collect data from form

    try {
      // Step 1: Post Product Data
      const productData = new FormData();
      productData.append("name", formData.get("name"));
      productData.append("price", formData.get("price"));
      productData.append("brand", formData.get("brand"));
      productData.append("num", formData.get("num"));
      productData.append("description", formData.get("description"));
      productData.append("skill_lv", formData.get("skill_lv"));
      productData.append("category", formData.get("category"));

      const productResponse = await axios.post(
        "http://127.0.0.1:8000/api/product/post",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //alert("Product upload successful!");
      console.log("Product Uploaded:", productResponse.data);

      const productId = productResponse.data.id;

      // Step 2: Post Product Image
      const imageData = new FormData();
      imageData.append("product", productId); // Include the product ID
      imageData.append("img", formData.get("img"));
      imageData.append("primary", formData.get("primary") ? true : false);

      const imageResponse = await axios.post(
        "http://127.0.0.1:8000/api/img/post",
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //alert("Image upload successful!");
      console.log("Image Uploaded:", imageResponse.data);

      // Step 3: Post Product Audio (Only if audio is provided)
      const audioFile = formData.get("audio");
      if (audioFile) {
        const audioData = new FormData();
        audioData.append("product", productId); // Include the product ID
        audioData.append("equipment", formData.get("equipment"));
        audioData.append("audio", audioFile);

        try {
          const audioResponse = await axios.post(
            "http://127.0.0.1:8000/api/audio/post",
            audioData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Audio Uploaded:", audioResponse.data);
          alert("Audio upload successful!");
        } catch (audioError) {
          console.error("Error uploading audio:", audioError);
          //alert("There was an error uploading the audio. Please try again.");
        }
      }

      window.location.href = " http://localhost:1140/list";
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error uploading the product. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file.name);
      if (file.size > 20000000) {
        // 5MB file size limit
        alert("File size too large!");
        return;
      }
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
            <br />
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
            <br />
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
            <br />
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
            <br />
            <div>
              <label>Description (File):</label>
              <input
                type="file"
                onChange={handleFileChange}
                name="description"
                className="hover:file:cursor-pointer block w-1/2 text-sm file:bg-green-500 file:text-white file:px-4 file:py-2 file:rounded file:mt-4 hover:file:bg-green-600"
              />
            </div>
            <br />
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
            <br />
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
          <br />
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
            <br />
            <div>
              <label htmlFor="primary">Primary Image:</label>
              <input type="checkbox" id="primary" name="primary" />
            </div>
          </div>
          <br />
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
            <br />
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
          <br />
          <button
            type="submit"
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};


