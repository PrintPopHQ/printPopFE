"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      orderNumber: "",
      description: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      orderNumber: Yup.string().required("Order Number is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      // Handle form submission logic
      console.log("Contact form submitted:", values);
      alert("Form submitted successfully!");
      formik.resetForm();
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
        <label className="text-sm font-medium text-white">Order Number*</label>
        <Input
          name="orderNumber"
          type="text"
          placeholder="Enter your Order Number"
          className="bg-[#0B1C32] border-[#494949] h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.orderNumber}
        />
        {formik.touched.orderNumber && formik.errors.orderNumber ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.orderNumber}</div>
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
          disabled={!formik.isValid || !formik.dirty}
          className="px-10 h-12 rounded-xl mt-4 font-bold tracking-widest text-white hover:opacity-90 shadow-glow-red"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          SUBMIT
        </Button>
      </div>
    </form>
  );
}
