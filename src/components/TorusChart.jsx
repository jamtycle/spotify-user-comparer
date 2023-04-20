// Credits to: https://www.smashingmagazine.com/2023/03/dynamic-donut-charts-tailwind-css-react/
import React from 'react';
import PropTypes from 'prop-types';

const TorusChart = ({ data }) => {
    const css_string = data
        .map((chart) => {
            const { color, start_degrees, end_degrees } = chart;
            return `${color} ${start_degrees}deg ${end_degrees}deg`;
        })
        .join();

    return (
        <div className='flex flex-col gap-8 grow'>
            <div className='flex grow justify-center'>
                <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full rounded-full'>
                    <clipPath id='hole'>
                        <path d='M 50 0 a 50 50 0 0 1 0 100 50 50 0 0 1 0 -100 v 18 a 2 2 0 0 0 0 64 2 2 0 0 0 0 -64' />
                    </clipPath>

                    <foreignObject x='0' y='0' width='100' height='100' clipPath='url(#hole)'>
                        <div
                            xmlns='http://www.w3.org/1999/xhtml'
                            className='w-full h-full'
                            style={{
                                background: `conic-gradient(${css_string})`,
                            }}
                        />
                    </foreignObject>
                </svg>
            </div>
        </div>
    );
};

TorusChart.propTypes = {
    /** Shape of the data to drive the chart */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            color: PropTypes.string,
        })
    ).isRequired,
};

export default TorusChart;