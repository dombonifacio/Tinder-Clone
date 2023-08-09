import { useState } from "react"
import { AiFillStar } from 'react-icons/ai'

export const ReviewsComponent = ({data, totalReviews}) => {
   
    return (
        <div className="px-4 ">
            <h1 className="font-medium my-2">{totalReviews} Reviews</h1>
            {/* Just spacings beteen the reviews */}
            <div className="flex flex-col gap-y-2">

                {data?.map((review) => {
                return (
                    <>
                        <div className="flex gap-x-2">
                
                            <img src={review.reviewedBy.images[0]} className="w-12 h-12 rounded-full object-cover object-center"/>
                            <div className="flex flex-col">
                                <div className="flex gap-x-1">

                                    <p className="text-md font-medium flex items-end">
                                        <span className="flex ">
                                            <AiFillStar color="yellow" size={"1.4rem"}/>
                                        </span>
                                        {review.rating}
                                    </p>
                                    <p className="text-md font-light text-slate-600">
                                        rated by
                                    </p>
                                    <p className="text-md font-medium">{review.reviewedBy.name.charAt(0).toUpperCase() + review.reviewedBy.name.slice(1)}</p>
                                </div>
                                
                                <p className="font-light text-sm text-slate-700">{review.description}</p>
                            </div>
                        </div>
                    </>
                    )
                })}
            </div>
        </div>
    )
}