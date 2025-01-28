'use client';

import { useState } from "react";
import dayjs from "dayjs";

export default function ReportPage() {
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    return (
        <div className="card">
            <h1>Repair Records</h1>
            <div className="flex gap-4 items-center">
                <div className="w-[80px] text-right">For Date</div>
                <div className="w-[200px]">
                    <input type="date" className="form-control w-full" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="w-[80px] text-right">To Date</div>
                <div className="w-[200px]">
                    <input type="date" className="form-control w-full"
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="w-[200px]">
                    <button className="btn-primary" style={{ marginTop: '5px' }}>
                        <i className="fa-solid fa-search mr3"></i>
                        Search
                    </button>
                    
                </div>
            </div>
        </div>
    )
}