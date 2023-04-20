// Credits to: https://www.smashingmagazine.com/2023/03/dynamic-donut-charts-tailwind-css-react/
import React from 'react';
import PropTypes from 'prop-types';

const ChartLegend = ({ data, title, sub_title }) => {
    const max = data.slice(1, data.length - 1).reduce((ini, val) => {
        if (val[1] > ini) return val[1];
        else return ini;
    }, -Infinity);

    return (
        <div className='flex flex-col gap-8 grow'>
            <div className='flex flex-col'>
                <h2 className='m-0 text-white text-4xl font-bold'>{title}</h2>
                <small className='m-0 text-gray-300 leading-none text-2xl mt-1'>{sub_title}</small>
            </div>
            <div className="overflow-y-auto select-none">
                <ul className='list-none flex flex-col gap-2 m-0 pr-5 p-0 text-gray-200'>
                    {data.slice(1).map((item, i) => {
                        // const { name, color, value } = item;

                        return (
                            <li key={i} className='list-none m-0 flex items-center justify-between border-b-2 border-slate-600' style={{ fontSize: `${i === data.length - 2 ? 1.5 : ((item[1] / max) * 4)}em` }}>
                                <span className='flex items-center gap-2'>
                                    {/* <span className='block w-3 h-3 rounded-full' style={{ backgroundColor: color }} /> */}
                                    {item[0]}
                                </span>
                                <span>{item[1]}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

// ChartLegend.propTypes = {
//     /** Shape of the data to drive the legend */
//     data: PropTypes.arrayOf(
//         PropTypes.shape({
//             name: PropTypes.string.isRequired,
//             value: PropTypes.number.isRequired,
//             color: PropTypes.string,
//         })
//     ).isRequired,
// };

export default ChartLegend;