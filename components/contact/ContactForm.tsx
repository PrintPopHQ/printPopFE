"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContactMutation } from "@/packages/Mutations";
import { toast } from "sonner";

export function ContactForm() {
  const contactMutation = useContactMutation();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      referenceType: "order",
      referenceNumber: "",
      description: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      referenceNumber: Yup.string(),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          full_name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          order_number: values.referenceNumber,
          reference_type: values.referenceType,
          description: values.description,
        };

        const response = await contactMutation.mutateAsync(payload);
        toast.success(response.message || "Contact form submitted successfully");
        formik.resetForm();
      } catch (error: any) {
        console.error("Contact form error:", error);
        toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-1 mt-6">
        <label className="text-sm font-medium text-white">First Name*</label>
        <Input
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          className="bg-[#0B1C32] border-[#494949] h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-white">Last Name*</label>
        <Input
          name="lastName"
          type="text"
          placeholder="Enter your last name"
          className="bg-[#0B1C32] border-[#494949] h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-white">Email*</label>
        <Input
          name="email"
          type="email"
          placeholder="Enter your Email"
          className="bg-[#0B1C32] border-[#494949] h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-white">
          {formik.values.referenceType === "order" ? "Order Number" : "Franchise Number"}
        </label>
        <div className="flex gap-2">
          <div className="relative w-36 shrink-0">
            <select
              name="referenceType"
              className="w-full bg-[#0B1C32] border border-[#494949] h-12 rounded-xl text-white pl-4 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-[#494949] text-xs appearance-none cursor-pointer"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.referenceType}
            >
              <option value="order" className="bg-[#0B1C32]">Order #</option>
              <option value="franchise" className="bg-[#0B1C32]">Franchise #</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
               <span className="material-symbols-outlined text-base">keyboard_arrow_down</span>
            </div>
          </div>
          <Input
            name="referenceNumber"
            type="text"
            placeholder={`Enter ${formik.values.referenceType === "order" ? "Order" : "Franchise"} Number`}
            className="bg-[#0B1C32] border-[#494949] h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary flex-1"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.referenceNumber}
          />
        </div>
        {formik.touched.referenceNumber && formik.errors.referenceNumber ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.referenceNumber}</div>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-white">Description*</label>
        <textarea
          name="description"
          placeholder="Enter Description"
          className="w-full bg-[#0B1C32] border border-[#494949] text-white placeholder:text-gray-500 rounded-xl min-h-[140px] p-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-[#494949] resize-y text-sm"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        ></textarea>
        {formik.touched.description && formik.errors.description ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
        ) : null}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || contactMutation.isPending}
          className="px-10 h-12 rounded-xl mt-4 font-bold tracking-widest text-white hover:opacity-90 shadow-glow-red"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          {contactMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
        </Button>
      </div>
    </form>
  );
}
