import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface FormattedInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  format: "aadhar" | "phone";
}

export function FormattedInput({ format, ...props }: FormattedInputProps) {
  const [formattedValue, setFormattedValue] = useState("");

  const formatValue = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (format === "aadhar") {
      return digitsOnly
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim()
        .slice(0, 14);
    } else if (format === "phone") {
      return digitsOnly
        .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        .trim()
        .slice(0, 14);
    }
    return digitsOnly;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatValue(e.target.value);
    setFormattedValue(formatted);
    if (props.onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted.replace(/\D/g, ""),
        },
      };
      props.onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <Input
      {...props}
      value={formattedValue}
      onChange={handleChange}
      maxLength={format === "aadhar" ? 14 : 14}
    />
  );
}
