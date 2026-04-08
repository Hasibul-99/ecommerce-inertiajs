import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface ProgressTrackerProps {
    currentStatus: string;
    progressPercentage: number;
}

interface Step {
    status: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    step: number;
}

export default function ProgressTracker({ currentStatus, progressPercentage }: ProgressTrackerProps) {
    const steps: Step[] = [
        { status: 'pending', title: 'Order Placed', icon: FiPackage, step: 0 },
        { status: 'processing', title: 'Processing', icon: FiClock, step: 1 },
        { status: 'shipped', title: 'Shipped', icon: FiTruck, step: 2 },
        { status: 'delivered', title: 'Delivered', icon: FiCheckCircle, step: 3 },
    ];

    const statusToStep: Record<string, number> = {
        'pending': 0,
        'confirmed': 0,
        'processing': 1,
        'ready_to_ship': 1,
        'shipped': 2,
        'in_transit': 2,
        'out_for_delivery': 2,
        'delivered': 3,
        'cancelled': -1,
        'refunded': -1,
    };

    const currentStep = statusToStep[currentStatus] ?? 0;
    const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded';

    if (isCancelled) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <FiAlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-900">Order {currentStatus}</h3>
                        <p className="text-sm text-red-700">
                            This order has been {currentStatus}. Please contact support if you have questions.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* Progress Bar Background */}
            <div className="relative mb-8">
                <div className="absolute top-6 left-0 right-0 h-2 bg-gray-200 rounded-full"
                     style={{ marginLeft: '2.5rem', marginRight: '2.5rem' }}>
                    {/* Animated Progress Bar Fill */}
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((stepInfo, index) => {
                        const Icon = stepInfo.icon;
                        const isCompleted = currentStep >= stepInfo.step;
                        const isCurrent = currentStep === stepInfo.step;

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center z-10"
                                style={{ width: `${100 / steps.length}%` }}
                            >
                                {/* Icon Circle */}
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-blue-200 animate-pulse' : ''}`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>

                                {/* Step Title */}
                                <p className={`text-sm font-medium text-center transition-colors ${
                                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                    {stepInfo.title}
                                </p>

                                {/* Active Indicator */}
                                {isCurrent && (
                                    <div className="mt-2">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                            Current
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progress Percentage */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                        {progressPercentage}% Complete
                    </span>
                </div>
            </div>
        </div>
    );
}
