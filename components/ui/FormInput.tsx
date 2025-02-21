import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean; // เพิ่ม prop required
};

const FormInput = (props: FormInputProps) => {
  const { name, type, label, defaultValue, placeholder, required } = props;
  
  return (
    <div className="mb-4">
      {label && <Label htmlFor={name} className="text-gray-700 font-semibold">{label}</Label>}
      <Input 
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required} // ใช้ required
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 transition"
      />
    </div>
  );
};

export default FormInput;
