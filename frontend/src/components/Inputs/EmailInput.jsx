import React from "react";
import { Input } from "@nextui-org/react";
import { Email } from "../../utils/Icons";

const EmailInput = ({ value, onChange, errors, noDescription }) => {
  return (
    <Input
      type="email"
      label="Email"
      name="email"
      value={value}
      onChange={onChange}
      isInvalid={!!errors?.email}
      errorMessage={errors?.email}
      placeholder="Enter your email"
      startContent={<Email />}
      className="text-primary mt-2"
      description={
        !noDescription && "We'll never share your email with anyone else."
      }
      classNames={{
        description: !noDescription ? "text-gray-600 text-sm" : "",
        errorMessage: "text-red-500 font-medium",
      }}
    />
  );
};

export default EmailInput;
