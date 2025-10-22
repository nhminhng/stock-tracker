'use client';
import React from 'react'
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import {signInWithEmail, signUpWithEmail} from "@/lib/actions/auth.actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const SignIn = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur'
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if (result.success) router.push('/');
        } catch (e) {
            console.log(e);
            toast.error("Sign in failed.", {
                description: e instanceof Error ? e.message : 'Failed to sign in',
            });
        }
    }

    return (
        <>
            <h1 className="form-title">Sign In</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="contact@test.com"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: "Email is required",
                        pattern: {
                            value: /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
                            message: "Email address format is required",
                        },
                    }}
                />
                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password is required", minLength: 8 }}
                />
                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing in' : 'Sign In'}
                </Button>
                <FooterLink text="Don't have an account?" linkText="Sign up" href="/sign-up" />
            </form>
        </>
    )
}
export default SignIn
