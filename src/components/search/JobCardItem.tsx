import React from 'react';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Job } from '../../types';

interface JobCardItemProps {
  job: Job;
  idx: number;
  onClick: () => void;
  toggleBookmark: (id: string) => void;
  isActive?: boolean;
}

export const JobCardItem: React.FC<JobCardItemProps> = ({
  job,
  idx,
  onClick,
  toggleBookmark,
  isActive = false,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min((idx % 5) * 0.02, 0.08), ease: "easeOut" }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 flex flex-col gap-3.5 relative transition-all duration-300 cursor-pointer border ${
        isActive 
          ? 'border-brand-primary bg-brand-primary/[0.02] ring-2 ring-brand-primary/10 shadow-[0_12px_28px_rgba(26,35,126,0.06)]' 
          : 'border-slate-100 hover:border-brand-primary/20 hover:bg-slate-50/40 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_28px_rgba(26,35,126,0.07),_0_4px_10px_rgba(26,35,126,0.03)]'
      } group`}
    >
      <div className="flex gap-3.5 items-start">
        <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-transform group-hover:scale-105 duration-300">
          {job.logoUrl ? (
            <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <Briefcase size={20} className="text-slate-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-sm md:text-[15px] text-slate-800 leading-snug truncate group-hover:text-brand-primary transition-colors">
            {job.title}
          </h2>
          <p className="text-[11px] text-slate-400 font-bold truncate mt-0.5">
            {job.company}
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="font-sans font-extrabold text-brand-primary text-base leading-none">
          {job.salary}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.tags.slice(0, 3).map((tag, tIdx) => (
          <span
            key={tIdx}
            className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="h-[1px] bg-slate-100/80 w-full" />

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate">
            <Clock size={11} className="text-slate-300 shrink-0" />
            <span className="truncate">{job.periodText || "Bugun, 08:00~17:00"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate">
            <MapPin size={11} className="text-slate-300 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-brand-primary shrink-0 self-end bg-brand-primary/10 px-2 py-0.5 rounded-md">
          {job.durationLabel || "12 soat"}
        </span>
      </div>
    </motion.article>
  );
};
