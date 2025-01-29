'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import config from "@/app/config";
import Swal from "sweetalert2";
import Chart from "apexcharts";

export default function Page() {
    const [totalRepairRecord, setTotalRepairRecord] = useState(0);
    const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
    const [totalSuccess, setTotalSuccess] = useState(0);
    const [totalRepairRecordNotComplete, setTotalRepairRecordNotComplete] = useState(0);

    useEffect(() => {
        fetchData();
        
    }, []);

    const fetchData = async () => {
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/dashboard`);

        setTotalRepairRecord(response.data.totalRepairRecord);
        setTotalRepairRecordComplete(response.data.totalRepairRecord);
        setTotalSuccess(response.data.totalSuccess);
        setTotalRepairRecordNotComplete(response.data.totalRepairRecordNotComplete);

        renderChartIncomePerDay();
        renderChartIncomePerMount();
        renderChartPie(
            response.data.totalRepairRecordComplete, 
            response.data.totalRepairRecordNotComplete, 
            response.data.totalRepairRecord, 
            response.data.totalSuccess
        );
    };

    const renderChartIncomePerDay = () => {
        const data = Array.from({ length: 31 }, () => Math.floor(Math.random() * 10000));
        const option = {
            chart: { type: 'bar', height: 250, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: Array.from({ length: 31 }, (_, index) => index + 1), // ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            },
        };
        const chartIncomePerDay = document.getElementById('chartIncomePerDay');
        const chart = new Chart(chartIncomePerDay, option);
        chart.render();
    };

    const renderChartIncomePerMount = () => {
        const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10000));
        const option = {
            chart: { type: 'bar', height: 250, background: 'white' },
            series: [{ data: data }],
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
        };
        const chartIncomePerMonth = document.getElementById('chartIncomePerMonth');
        const chart = new Chart(chartIncomePerMonth, option);
        chart.render();
    };

    const renderChartPie = (
        totalRepairRecordComplete: number, 
        totalRepairRecordNotComplete: number, 
        totalRepairRecord: number, 
        totalSuccess: number
    ) => {
        const data = [
            totalRepairRecordComplete, 
            totalRepairRecordNotComplete,
            totalRepairRecord, 
            totalSuccess
        ];
        const options = { 
            chart: { type: 'pie', height: 250, background: 'white' },
            series: data,
            labels: ['Complete', 'Not Complete', 'All', 'Success'],
        };
        const chartPie = document.getElementById('chartPie');
        const chart = new Chart(chartPie, options);
        chart.render();

    }

    return (
        <>
            <div className="text-2xl font-bold">Dashboard</div>
            <div className="flex mt-5 gap-4">
                <div className="w-1/4 bg-indigo-500 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">Work All</div>
                    <div className="text-4xl font-bold">{totalRepairRecord}</div>
                </div>
                <div className="w-1/4 bg-green-500 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">Complete</div>
                    <div className="text-4xl font-bold">{totalRepairRecordComplete}</div>
                </div>
                <div className="w-1/4 bg-orange-500 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">Success</div>
                    <div className="text-4xl font-bold">{totalSuccess}</div>
                </div>
                <div className="w-1/4 bg-pink-500 p-4 rounded-lg text-right">
                    <div className="text-xl font-bold">Repairing</div>
                    <div className="text-4xl font-bold">{totalRepairRecordNotComplete}</div>
                </div>
            </div>

            <div className="text-2xl font-bold mt-5">InputPerDay</div>
            <div id="chartIncomePerDay"></div>

            <div className="flex gap-4">
                <div className="w-1/2">
                    <div className="text-2xl font-bold mt-5 mb-2">InputPerMount</div>
                    <div id="chartIncomePerMonth"></div>
                </div>
                <div className="w-1/2">
                    <div className="text-2xl font-bold mt-5 mb-2">Work All</div>
                    <div id="chartPie"></div>
                </div>
            </div>

            
        </>


    )
}