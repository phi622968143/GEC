import { render, screen } from "@testing-library/react";
import App from "./ProductDetail";
import axios from "axios";
import { jest } from "@jest/globals";

// Mock axios
jest.mock("axios");

const BASE_URL = "http://localhost:8000";

describe("App Component", () => {
  // reset
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("成功獲取並顯示圖片", async () => {
    const imagePath = `/media/product_img/test2.png`;

    axios.get.mockResolvedValueOnce({
      data: {
        image: imagePath,
        primary: true,
      },
    });

    render(<App />);

    const imgElement = await screen.findByAltText("Product");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", `${BASE_URL}${imagePath}`);
  });
});
