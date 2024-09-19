"use client"

import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signInSchema } from "@/lib/zod" 
import LoadingButton from "@/components/loading-button"
import { handleCredentialsSignIn, handleGithubSignIn } from "@/app/actions/authAction"
import { useState } from "react"
import ErrorMessage from "@/components/error-message"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"

export default function SignIn() {
    const [globalError, setGlobalError] = useState<string>("")
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        try {
            const result = await handleCredentialsSignIn(values);
        }
        catch (error) {
            console.log("An unexpected error occurred. Please try again.")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-gray-800">
                        Sign In
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {globalError && <ErrorMessage error={globalError} />}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField 
                                control={form.control}
                                name="email" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email" 
                                                placeholder="Enter your email address"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="password" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="Enter password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />  

                            <LoadingButton pending={form.formState.isSubmitting} />  
                        </form>
                    </Form>
                    <span className="text-sm text-gray-500 text-center block my-2">
                        or
                    </span>

                    <form className="w-full" action={handleGithubSignIn}>
                        <Button className="w-full" variant="default" type="submit">
                            <GithubIcon className="w-4 h-4 mr-2" />
                            Sign In with GitHub
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}