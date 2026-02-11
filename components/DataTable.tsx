
import React from 'react';
import { GeneratedRow } from '../types';

interface DataTableProps {
  data: GeneratedRow[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-[#D5DEEF] bg-white custom-scrollbar">
      <table className="min-w-full divide-y divide-[#D5DEEF]">
        <thead className="bg-[#F0F3FA]">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-[10px] font-bold text-[#395886] uppercase tracking-widest whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D5DEEF] bg-white">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-[#F0F3FA]/50 transition-all-300">
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-[#395886] font-medium">
                  {String(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
