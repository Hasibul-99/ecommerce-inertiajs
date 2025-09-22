import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/Core/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Breadcrumb Section */}
            <section className="gi-breadcrumb-section py-[20px] bg-[#f8f8fb]">
                <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
                    <div className="w-full px-[12px]">
                        <div className="gi-breadcrumb-box">
                            <h1 className="gi-breadcrumb-title text-[20px] font-medium text-[#4b5966] capitalize tracking-[0.02rem] leading-[1.2] mb-[6px]">Register Page</h1>
                            <ul className="gi-breadcrumb-list flex flex-wrap items-center">
                                <li className="gi-breadcrumb-item text-[14px] text-[#777] font-normal leading-[1.5] tracking-[0.02rem] relative pr-[10px] mr-[10px] before:content-['/'] before:absolute before:right-0 before:top-0">
                                    <Link href="/" className="text-[#777] hover:text-[#5caf90]">Home</Link>
                                </li>
                                <li className="gi-breadcrumb-item text-[14px] text-[#777] font-normal leading-[1.5] tracking-[0.02rem] relative">
                                    Register
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Register Section */}
            <section className="gi-register-section py-[40px] max-[767px]:py-[30px]">
                <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
                    <div className="gi-register-content max-w-[1000px] m-auto flex flex-row max-[991px]:flex-col max-[1199px]:px-[12px] max-[991px]:w-full">
                        <div className="gi-register-box w-[50%] px-[15px] max-[991px]:w-full max-[991px]:p-[0] max-[991px]:hidden">
                            <div className="gi-register-img">
                                <img src="/assets/img/common/register.png" alt="register" className="w-full rounded-[5px]" />
                            </div>
                        </div>
                        <div className="gi-register-box w-[50%] px-[15px] max-[991px]:w-full max-[991px]:p-[0]">
                            <div className="gi-register-wrapper max-w-[530px] my-[0] mx-auto">
                                <div className="gi-register-container p-[30px] max-[575px]:p-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-left bg-[#fff]">
                                    <div className="gi-register-form">
                                        <form onSubmit={submit} className="flex flex-col">
                                            <span className="gi-register-wrap flex flex-col">
                                                <label className="mb-[10px] text-[#4b5966] text-[15px] font-medium tracking-[0] leading-[1]">Full Name*</label>
                                                <input 
                                                    type="text" 
                                                    name="name" 
                                                    placeholder="Enter your full name" 
                                                    className="mb-[27px] px-[15px] bg-transparent border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] outline-[0] h-[50px]" 
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required 
                                                />
                                                <InputError message={errors.name} className="mt-[-20px] mb-[15px]" />
                                            </span>
                                            <span className="gi-register-wrap flex flex-col">
                                                <label className="mb-[10px] text-[#4b5966] text-[15px] font-medium tracking-[0] leading-[1]">Email Address*</label>
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    placeholder="Enter your email address" 
                                                    className="mb-[27px] px-[15px] bg-transparent border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] outline-[0] h-[50px]" 
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required 
                                                />
                                                <InputError message={errors.email} className="mt-[-20px] mb-[15px]" />
                                            </span>
                                            <span className="gi-register-wrap flex flex-col">
                                                <label className="mb-[10px] text-[#4b5966] text-[15px] font-medium tracking-[0] leading-[1]">Password*</label>
                                                <input 
                                                    type="password" 
                                                    name="password" 
                                                    placeholder="Enter your password" 
                                                    className="mb-[27px] px-[15px] bg-transparent border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] outline-[0] h-[50px]" 
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required 
                                                />
                                                <InputError message={errors.password} className="mt-[-20px] mb-[15px]" />
                                            </span>
                                            <span className="gi-register-wrap flex flex-col">
                                                <label className="mb-[10px] text-[#4b5966] text-[15px] font-medium tracking-[0] leading-[1]">Confirm Password*</label>
                                                <input 
                                                    type="password" 
                                                    name="password_confirmation" 
                                                    placeholder="Confirm your password" 
                                                    className="mb-[15px] px-[15px] bg-transparent border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] outline-[0] h-[50px]" 
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    required 
                                                />
                                                <InputError message={errors.password_confirmation} className="mt-[-10px] mb-[15px]" />
                                            </span>
                                            <span className="gi-register-wrap gi-register-btn mt-[30px] flex flex-row justify-between items-center">
                                                <span className="text-[#777] text-[14px]">
                                                    <Link href={route('login')} className="text-[#4b5966] hover:text-[#5caf90]">Already have an account?</Link>
                                                </span>
                                                <button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="gi-btn-1 btn py-[8px] px-[15px] bg-[#4b5966] text-[#fff] border-[0] transition-all duration-[0.3s] ease-in-out overflow-hidden text-center text-[14px] font-semibold relative rounded-[5px] hover:bg-[#5caf90] hover:text-[#fff] disabled:opacity-75"
                                                >
                                                    Register
                                                </button>
                                            </span>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
