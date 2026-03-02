'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { getAccessToken } from '@/lib/auth-store';
import { useChangePasswordMutation } from '@/packages/Mutations';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function SecurityTab() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const changePasswordMutation = useChangePasswordMutation();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required').min(8, 'Password must be at least 8 characters'),
      newPassword: Yup.string().required('New password is required').min(8, 'Password must be at least 8 characters'),
      confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setMessage('');
      setError('');

      const token = getAccessToken();
      if (!token) {
        setError('You must be logged in to change your password.');
        setSubmitting(false);
        return;
      }

      const payload = {
        current_password: values.currentPassword,
        new_password: values.newPassword,
      };

      changePasswordMutation.mutate(
        { payload, token },
        {
          onSuccess: (data) => {
            if (data && data.responseCode === 2000) {
              setMessage(data.message || 'Password changed successfully.');
              resetForm();
            } else {
              setError(data?.message || 'Failed to change password.');
            }
          },
          onError: (err: any) => {
            setError(err.response?.data?.message || err.message || 'An error occurred.');
          },
          onSettled: () => {
            setSubmitting(false);
          }
        }
      );
    },
  });

  return (
    <div className="space-y-8 md:max-w-xl">
      <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-white">Current Password</label>
          <div className="relative">
            <Input
              name="currentPassword"
              type={showPassword.current ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
              placeholder="Enter Current Password"
              className={`bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary ${formik.touched.currentPassword && formik.errors.currentPassword ? 'border-red-500' : ''
                }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
            >
              {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</div>
          ) : null}
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-white">New Password</label>
          <div className="relative">
            <Input
              name="newPassword"
              type={showPassword.new ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              placeholder="Enter New Password"
              className={`bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary ${formik.touched.newPassword && formik.errors.newPassword ? 'border-red-500' : ''
                }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
            >
              {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</div>
          ) : null}
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-white">Confirm New Password</label>
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              placeholder="Confirm New Password"
              className={`bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''
                }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
            >
              {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>

        {message && <p className="text-green-500 text-sm font-medium">{message}</p>}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div className="pt-6">
          <Button
            type="submit"
            disabled={changePasswordMutation.isPending || formik.isSubmitting || !formik.isValid}
            className="w-full text-white font-bold h-12 rounded-xl font-neon tracking-widest shadow-glow-red hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)' }}
          >
            {changePasswordMutation.isPending || formik.isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </Button>
        </div>
      </form>
    </div>
  );
}
