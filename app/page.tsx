"use client";

import { fetchCars } from "@/utils";
// import { HomeProps } from "@/types";
import { fuels, yearsOfProduction } from "@/constants";
import Hero from "@/components/Hero";
import SearchBar from "@/components/Searchbar";
import CustomFilter from "@/components/CustomFilter";
import CarCard from "@/components/CarCard";
import ShowMore from "@/components/ShowMore";
import { useEffect, useState } from "react";
import Image from "next/image";

export default async function Home() {
    // const allCars = await fetchCars({
    //     manufacturer: searchParams.manufacturer || "",
    //     year: searchParams.year || 2022,
    //     fuel: searchParams.fuel || "",
    //     limit: searchParams.limit || 10,
    //     model: searchParams.model || "",
    // });

    const [allCars, setAllCars] = useState([]);
    const [loading, setLoading] = useState(false);

    // search states
    const [manufacturer, setManufacturer] = useState("");
    const [model, setModel] = useState("");

    // filter states
    const [fuel, setFuel] = useState("");
    const [year, setYear] = useState(2022);

    // pagination states
    const [limit, setLimit] = useState(10);

    const getCars = async () => {
        setLoading(true);

        try{
            const cars = await fetchCars({
                manufacturer: manufacturer || '',
                year: year || 2022,
                fuel: fuel || '',
                limit: limit || 10,
                model: model || '',
            });
    
            setAllCars(cars);
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getCars();
    }, [manufacturer, model, fuel, year, limit]);

    // const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
    console.log(allCars);

    return (
        <main className='overflow-hidden'>
            <Hero />

            <div className='mt-12 padding-x padding-y max-width' id='discover'>
                <div className='home__text-container'>
                    <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
                    <p>Explore out cars you might like</p>
                </div>

                <div className='home__filters'>
                    <SearchBar setManufacturer={setManufacturer} setModel={setModel}/>

                    <div className='home__filter-container'>
                        <CustomFilter title='fuel' options={fuels} setFilter={setFuel}/>
                        <CustomFilter title='year' options={yearsOfProduction} setFilter={setYear} />
                    </div>
                </div>

                {allCars.length > 0 ? (
                    <section>
                        <div className='home__cars-wrapper'>
                            {allCars?.map((car) => (
                                <CarCard car={car} />
                            ))}
                        </div>

                        {
                            loading && (
                                <div className='w-full flex-center mt-16'>
                                    <Image 
                                        src='/loading.svg' 
                                        width={50} 
                                        height={50} 
                                        alt='loading'
                                        className="object-contain"
                                    />
                                </div>
                            )
                        }

                        <ShowMore
                            pageNumber={limit / 10}
                            isNext={limit > allCars.length}
                            setLimit={setLimit}
                        />
                    </section>
                ) : (
                    <div className='home__error-container'>
                        <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
                        <p>{allCars?.message}</p>
                    </div>
                )}
            </div>
        </main>
    );
}