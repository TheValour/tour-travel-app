import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import getTourDetails from '../Constant';
import { FeatureContext } from '../../context/feature';
import { AuthContext } from '../../context/AuthContext';
import "./booking.css";

export default function Booking() {
    const { title } = useParams();
    const { prices } = getTourDetails(title);
    const { bookingTour } = useContext(FeatureContext);
    const { user, sendMailToCustomer } = useContext(AuthContext);
    const navigate = useNavigate();

    const [journeyDate, setJourneyDate] = useState('');
    const [responseId, setResponseId] = useState();
    const [numMembers, setNumMembers] = useState('');
    const [name, setName] = useState('');
    const [paymentBy, setPaymentBy] = useState('');
    const [carType, setcarType] = useState(Object.keys(prices)[0]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!user) {
            alert("Please login to book a tour");
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        setIsFormValid(journeyDate && numMembers && name && carType);
    }, [journeyDate, numMembers, name, carType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle booking logic here
        await bookingTour({
            journeyDate,
            carType,
            numMembers,
            name,
            paymentBy,
        });
        alert('Tour booked successfully!');
        return true;
    };

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");

            script.src = src;

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    const createRazorpayOrder = async (amount) => {
        const amountInDigits = parseInt(amount.replace(/[^0-9]/g, ''), 10);
        setPaymentBy(amountInDigits);   

        try {
            const response = await axios.post("http://localhost:5000/orders", {
                amount: amountInDigits * 100,
                currency: "INR"
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                maxBodyLength: Infinity
            });

            if (response.status === 200) {
                handleRazorpayScreen(amountInDigits);
            }
        
        } catch (error) {
            console.log("error at", error);
        }
    };

    const handleRazorpayScreen = async (amount) => {
        const res = await loadScript("https:/checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Some error at razorpay screen loading");
            return;
        }

        const options = {
            key: "rzp_test_XDRbGjMlhXYIUT",
            amount: amount * 100,
            currency: 'INR',
            name: "Sunraj Tours and Travels",
            description: "Payment to Sunraj tours and travels",
            image: "https://kydeedknficgzzfvfiiy.supabase.co/storage/v1/object/public/CODEBLOCK/public/logo.jpeg",
            
            handler: function (response) {
                console.log(response);
                setResponseId(response.razorpay_payment_id);
                
                sendMailToCustomer({
                    date : journeyDate,
                    carType,
                    numMembers,
                    name,
                    paymentDone : amount,
                    paymentId: response.razorpay_payment_id,
                    orderID: 1,
                })
                navigate('/done');
            },
            prefill: {
                name: "Sunraj tours and travels",
                email: "sunrajtoursandtravels@gmail.com"
            },
            theme: {
                color: "#F4C430"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className='FLEX w-screen h-screen'>
            <form onSubmit={handleSubmit}>
                <FormField label="Name:" type="text" value={name} onChange={setName} required />
                <FormField label="Journey Date:" type="date" value={journeyDate} onChange={setJourneyDate} required />
                <FormField label="Number of Members:" type="number" value={numMembers} onChange={setNumMembers} required />

                <FormField label="Car Type:" type="select" value={carType} onChange={setcarType} options={Object.keys(prices)} required />
                <label className=' text-blue-700 text-xl mb-4'>Selected Price: {prices[carType]}</label>

                <div className='FLEX mb-4'>
                    <input type="checkbox" required className='size-5 mb-0 mr-3' checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                    <span> I agree to the <Link to="/terms" className='text-blue-600'>privacy policy</Link></span>
                </div>

                <button type="button" onClick={() => createRazorpayOrder(prices[carType])} className='mb-4' disabled={!isFormValid || !isChecked}>Payment</button>

            </form>
        </div>
    );
}

function FormField({ label, type, value, onChange, options, required }) {
    return (
        <div>
            <label>{label}</label>
            {type === 'select' ? (
                <select value={value} onChange={(e) => onChange(e.target.value)} required={required}>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                />
            )}
        </div>
    );
}