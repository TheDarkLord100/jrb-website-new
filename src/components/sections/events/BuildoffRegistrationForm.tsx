// 'use client';

// import React, { useState } from 'react';
// import { supabase } from '@/lib/supabase/client'; // Update this path if your client is located elsewhere

// export default function BuildoffRegistrationForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [teamSize, setTeamSize] = useState<number>(3);

//   // State for Team & Captain
//   const [teamName, setTeamName] = useState('');
//   const [captainName, setCaptainName] = useState('');
//   const [captainEmail, setCaptainEmail] = useState('');
//   const [captainEntryNumber, setCaptainEntryNumber] = useState('');

//   // State for dynamic team members (excluding the Captain)
//   const [members, setMembers] = useState([
//     { name: '', entryNumber: '' },
//     { name: '', entryNumber: '' },
//   ]);

//   const handleTeamSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const size = parseInt(e.target.value, 10);
//     setTeamSize(size);

//     const membersNeeded = size - 1;

//     setMembers((prev) => {
//       const newMembers = [...prev];
//       while (newMembers.length < membersNeeded) {
//         newMembers.push({ name: '', entryNumber: '' });
//       }
//       if (newMembers.length > membersNeeded) {
//         newMembers.length = membersNeeded;
//       }
//       return newMembers;
//     });
//   };

//   const handleMemberChange = (index: number, field: 'name' | 'entryNumber', value: string) => {
//     setMembers((prev) => {
//       const newMembers = [...prev];
//       newMembers[index][field] = value;
//       return newMembers;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // 1. Insert Team into buildoff_teams
//       const { data: teamData, error: teamError } = await supabase
//         .from('buildoff_teams')
//         .insert([
//           {
//             team_name: teamName,
//             captain_name: captainName,
//             captain_email: captainEmail,
//             captain_entry_number: captainEntryNumber,
//           },
//         ])
//         .select()
//         .single();

//       if (teamError) throw teamError;

//       const teamId = teamData.id;

//       // 2. Prepare payload for the Captain
//       const captainPayload = {
//         team_id: teamId,
//         member_name: captainName,
//         entry_number: captainEntryNumber,
//         is_captain: true,
//       };

//       // 3. Prepare payload for the rest of the dynamic members
//       const membersPayload = members.map((member) => ({
//         team_id: teamId,
//         member_name: member.name,
//         entry_number: member.entryNumber,
//         is_captain: false,
//       }));

//       // 4. Batch insert all members (Captain + Teammates) into buildoff_team_members
//       const { error: membersError } = await supabase
//         .from('buildoff_team_members')
//         .insert([captainPayload, ...membersPayload]);

//       if (membersError) throw membersError;

//       alert('Registration successful! Your team is now registered.');

//       // Optional: Reset form state here or redirect the user
//       setTeamName('');
//       setCaptainName('');
//       setCaptainEmail('');
//       setCaptainEntryNumber('');
//       setTeamSize(3);
//       setMembers([
//         { name: '', entryNumber: '' },
//         { name: '', entryNumber: '' },
//       ]);
//     } catch (error: any) {
//       console.error('Registration error:', error.message);
//       alert('Registration failed: ' + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mx-auto max-w-3xl text-left">
//       {/* 1. TEAM DETAILS */}
//       <div className="mb-10 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
//         <h3 className="text-lg font-bold text-amber-400">1. Team Details</h3>
//         <div>
//           <label className="mb-2 block text-xs font-semibold text-gray-300">Team Name</label>
//           <input
//             type="text"
//             required
//             value={teamName}
//             onChange={(e) => setTeamName(e.target.value)}
//             placeholder="e.g. RoboHawks"
//             className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* 2. CAPTAIN DETAILS */}
//       <div className="mb-10 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
//         <h3 className="text-lg font-bold text-amber-400">2. Team Captain</h3>

//         <div className="grid gap-6 sm:grid-cols-2">
//           <div className="sm:col-span-2">
//             <label className="mb-2 block text-xs font-semibold text-gray-300">Captain's Name</label>
//             <input
//               type="text"
//               required
//               value={captainName}
//               onChange={(e) => setCaptainName(e.target.value)}
//               placeholder="Full Name"
//               className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
//             />
//           </div>
//           <div>
//             <label className="mb-2 block text-xs font-semibold text-gray-300">
//               IIT Delhi Email
//             </label>
//             <input
//               type="email"
//               required
//               value={captainEmail}
//               onChange={(e) => setCaptainEmail(e.target.value)}
//               placeholder="entrynumber@iitd.ac.in"
//               className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
//             />
//           </div>
//           <div>
//             <label className="mb-2 block text-xs font-semibold text-gray-300">Entry Number</label>
//             <input
//               type="text"
//               required
//               value={captainEntryNumber}
//               onChange={(e) => setCaptainEntryNumber(e.target.value)}
//               placeholder="e.g. 2023EE10123"
//               className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
//             />
//           </div>
//         </div>
//       </div>

//       {/* 3. DYNAMIC TEAM MEMBERS */}
//       <div className="mb-10 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
//         <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
//           <h3 className="text-lg font-bold text-amber-400">3. Team Members</h3>
//           <div className="flex items-center gap-3">
//             <label className="text-sm font-semibold text-gray-300">Total Team Size:</label>
//             <select
//               value={teamSize}
//               onChange={handleTeamSizeChange}
//               className="rounded-lg border border-white/10 bg-[#0F172A] px-3 py-1.5 text-sm text-white focus:border-amber-400 focus:outline-none"
//             >
//               <option value={3}>3 Members</option>
//               <option value={4}>4 Members</option>
//               <option value={5}>5 Members</option>
//             </select>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {members.map((member, index) => (
//             <div key={index} className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-xs font-semibold text-gray-300">
//                   Member {index + 2} Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={member.name}
//                   onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
//                   placeholder="Full Name"
//                   className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="mb-2 block text-xs font-semibold text-gray-300">
//                   Member {index + 2} Entry Number
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={member.entryNumber}
//                   onChange={(e) => handleMemberChange(index, 'entryNumber', e.target.value)}
//                   placeholder="e.g. 2023ME20456"
//                   className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* SUBMIT BUTTON */}
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full rounded-xl bg-amber-400 py-4 text-center text-sm font-bold text-[#001A23] transition-colors hover:bg-amber-300 disabled:opacity-70"
//       >
//         {isLoading ? 'Processing...' : 'Complete Registration'}
//       </button>
//     </form>
//   );
// }
