import React from "react";

const Newsletter = () => {
    return (
        <div>
           
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Poppins', sans-serif; }
`}</style>

<section className="flex flex-col items-center justify-center py-14 px-4 md:px-8 bg-gradient-to-b from-indigo-50 via-white to-white">
    
    {/* Tag */}
    <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-100 rounded-full px-3 py-1 animate-fadeIn">
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path d="M1.613 8.2a.62.62 0 0 1-.553-.341.59.59 0 0 1 .076-.637l6.048-6.118a.31.31 0 0 1 .375-.069c.061.033.11.084.137.147a.3.3 0 0 1 .014.197L6.537 4.991a.59.59 0 0 0 .07.552.61.61 0 0 0 .504.257h4.276a.62.62 0 0 1 .553.341.59.59 0 0 1-.076.637l-6.048 6.119a.31.31 0 0 1-.375.067.295.295 0 0 1-.15-.344l1.172-3.61a.59.59 0 0 0-.07-.553.61.61 0 0 0-.504-.257z"
            stroke="currentColor" strokeLinecap="round"/>
        </svg>
        <span>Fast & Easy Booking</span>
    </div>

    {/* Title */}
    <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mt-4 text-center">
        Book Your Ride With <span className="text-indigo-600 font-bold">Dahiya Car Rentals</span>
    </h1>

    {/* Subtitle */}
    <p className="max-w-xl text-center text-gray-600 mt-4 animate-fadeInSlow">
        Trusted by hundreds of travelers across Delhi NCR. Book premium cars for local & outstation trips effortlessly.
    </p>

    {/* Booking Form */}
    <form className="relative flex flex-col md:flex-row items-center rounded-md border border-slate-200 mt-6 text-sm max-w-lg w-full bg-white shadow-sm animate-slideUp">
        
        <input 
            type="text" 
            placeholder="example@gmail.com"
            className="focus:outline-none px-4 py-4 bg-transparent w-full text-gray-700"
            required
        />
        
        <button className="md:mr-2 m-2 px-6 py-3 text-sm bg-indigo-600 rounded-md active:scale-95 transition duration-300 text-white hover:bg-indigo-700 w-full md:w-auto">
            Subscribe
        </button>
    </form>

    {/* Sub text */}
    <p className="text-xs text-gray-500 mt-2">No hidden charges • 24/7 Support • Best Prices Guaranteed</p>

</section>



        </div>
    )
};
export default Newsletter;