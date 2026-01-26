import { useEffect, useState } from 'react';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

interface DeliveryCountdownProps {
    estimatedDelivery: string | null;
    isDelivered: boolean;
    deliveredAt?: string | null;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

export default function DeliveryCountdown({ estimatedDelivery, isDelivered, deliveredAt }: DeliveryCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
    });

    useEffect(() => {
        if (!estimatedDelivery || isDelivered) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(estimatedDelivery).getTime();
            const difference = target - now;

            if (difference <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    total: 0,
                });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                total: difference,
            });
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [estimatedDelivery, isDelivered]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isDelivered && deliveredAt) {
        return (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-green-900 mb-2">
                    Package Delivered!
                </h3>
                <p className="text-center text-green-700">
                    Your order was delivered on
                </p>
                <p className="text-center text-lg font-semibold text-green-900 mt-1">
                    {formatDate(deliveredAt)}
                </p>
            </div>
        );
    }

    if (!estimatedDelivery) {
        return (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Delivery date will be available once your order ships</p>
            </div>
        );
    }

    if (timeLeft.total <= 0) {
        return (
            <div className="bg-yellow-50 rounded-lg border-2 border-yellow-200 p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FiClock className="w-12 h-12 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-center text-yellow-900 mb-2">
                    Expected Today
                </h3>
                <p className="text-center text-yellow-700">
                    Your package should arrive today!
                </p>
            </div>
        );
    }

    const progress = 100 - Math.min(100, (timeLeft.days / 7) * 100);

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
            {/* Estimated Delivery Date */}
            <div className="text-center mb-6">
                <p className="text-sm font-medium text-blue-700 uppercase tracking-wide mb-1">
                    Estimated Delivery
                </p>
                <p className="text-xl font-bold text-blue-900">
                    {formatDate(estimatedDelivery)}
                </p>
            </div>

            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                        {timeLeft.days}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                        Days
                    </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                        {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                        Hours
                    </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                        Minutes
                    </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                        Seconds
                    </div>
                </div>
            </div>

            {/* Progress Ring */}
            <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#E0E7FF"
                            strokeWidth="8"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#3B82F6"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {Math.round(progress)}%
                            </div>
                            <div className="text-xs text-gray-600">Complete</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Remaining Text */}
            <p className="text-center text-sm text-blue-700">
                {timeLeft.days > 0 && `${timeLeft.days} day${timeLeft.days > 1 ? 's' : ''} `}
                {timeLeft.hours > 0 && `${timeLeft.hours} hour${timeLeft.hours > 1 ? 's' : ''} `}
                remaining
            </p>
        </div>
    );
}
