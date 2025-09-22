import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            {/* Breadcrumb Section */}
            <section className="gi-breadcrumb-section py-[20px] bg-[#f8f8fb]">
                <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
                    <div className="w-full px-[12px]">
                        <div className="gi-breadcrumb-box">
                            <h1 className="gi-breadcrumb-title text-[20px] font-medium text-[#4b5966] capitalize tracking-[0.02rem] leading-[1.2] mb-[6px]">Email Verification</h1>
                            <ul className="gi-breadcrumb-list flex flex-wrap items-center">
                                <li className="gi-breadcrumb-item text-[14px] text-[#777] font-normal leading-[1.5] tracking-[0.02rem] relative pr-[10px] mr-[10px] before:content-['/'] before:absolute before:right-0 before:top-0">
                                    <Link href="/" className="text-[#777] hover:text-[#5caf90]">Home</Link>
                                </li>
                                <li className="gi-breadcrumb-item text-[14px] text-[#777] font-normal leading-[1.5] tracking-[0.02rem] relative">
                                    Email Verification
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verify Email Section */}
            <section className="gi-verify-email-section py-[40px] max-[767px]:py-[30px]">
                <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
                    <div className="gi-verify-email-content max-w-[1000px] m-auto flex flex-row max-[991px]:flex-col max-[1199px]:px-[12px] max-[991px]:w-full">
                        <div className="gi-verify-email-box w-[50%] px-[15px] max-[991px]:w-full max-[991px]:p-[0]">
                            <div className="gi-verify-email-wrapper max-w-[530px] my-[0] mx-auto">
                                <div className="gi-verify-email-container p-[30px] max-[575px]:p-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-left bg-[#fff]">
                                    <div className="gi-verify-email-form">
                                        <div className="mb-[20px] text-[15px] text-[#4b5966] leading-[1.5]">
                                            Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                                            link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                                        </div>

                                        {status === 'verification-link-sent' && (
                                            <div className="mb-[20px] text-[15px] text-[#5caf90] font-medium leading-[1.5]">
                                                A new verification link has been sent to the email address you provided during registration.
                                            </div>
                                        )}

                                        <form onSubmit={submit} className="flex flex-col">
                                            <div className="mt-[30px] flex flex-row justify-between items-center">
                                                <button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="gi-btn-1 btn py-[8px] px-[15px] bg-[#4b5966] text-[#fff] border-[0] transition-all duration-[0.3s] ease-in-out overflow-hidden text-center text-[14px] font-semibold relative rounded-[5px] hover:bg-[#5caf90] hover:text-[#fff] disabled:opacity-75"
                                                >
                                                    Resend Verification Email
                                                </button>

                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="text-[#4b5966] text-[14px] hover:text-[#5caf90]"
                                                >
                                                    Log Out
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="gi-verify-email-box w-[50%] px-[15px] max-[991px]:w-full max-[991px]:p-[0] max-[991px]:hidden">
                            <div className="gi-verify-email-img">
                                <img src="/assets/img/common/verify-email.png" alt="verify email" className="w-full rounded-[5px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
