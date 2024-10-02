import React from "react";
import { Button } from "@nextui-org/react";

const SubmitButton = ({ isLoading, isDisabled }) => {
  return (
    <Button
      type="submit" // Important
      radius="md"
      isLoading={isLoading}
      isDisabled={isDisabled}
      className={`w-full mt-6 py-2 font-semibold text-white transition ${
        isDisabled
          ? "bg-gray-300 cursor-not-allowed text-gray-500"
          : "bg-blue-600 hover:bg-blue-500"
      }`}
    >
      Submit
    </Button>
  );
};

export default SubmitButton;
