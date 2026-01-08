import React, { forwardRef } from 'react';

export interface ResumeData {
    name: string;
    contact: string;
    skills: string[];
    summary: string;
    experience: {
        role: string;
        company: string;
        duration: string;
        bullets: string[];
    }[];
    education: {
        degree: string;
        school: string;
        year: string;
    }[];
    projects?: {
        name: string;
        description: string;
    }[];
}

interface Props {
    data: ResumeData;
}

export const ResumeTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    return (
        <div ref={ref} className="bg-white text-black p-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-none print:shadow-none" style={{ fontFamily: 'Times New Roman, serif' }}>
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.name || "Candidate Name"}</h1>
                <p className="text-sm">{data.contact || "Email | Phone | Location"}</p>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Professional Summary</h2>
                    <p className="text-sm leading-relaxed">{data.summary}</p>
                </div>
            )}

            {/* Skills */}
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
                <div className="text-sm">
                    {data.skills.join(" • ")}
                </div>
            </div>

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Professional Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{exp.role}</h3>
                                    <span className="text-sm italic">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-semibold mb-1">{exp.company}</div>
                                <ul className="list-disc ml-5 space-y-1">
                                    {exp.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx} className="text-sm leading-snug pl-1">{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Key Projects</h2>
                    <div className="space-y-3">
                        {data.projects.map((proj, idx) => (
                            <div key={idx}>
                                <h3 className="font-bold text-sm inline-block mr-2">{proj.name}:</h3>
                                <span className="text-sm">{proj.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Education</h2>
                <div className="space-y-2">
                    {data.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-baseline">
                            <div>
                                <span className="font-bold text-sm">{edu.school}</span>
                                <span className="text-sm"> - {edu.degree}</span>
                            </div>
                            <span className="text-sm italic">{edu.year}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
});

ResumeTemplate.displayName = 'ResumeTemplate';
