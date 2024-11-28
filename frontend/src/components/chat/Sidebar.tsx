import { difficulties, roleCategories } from '@/constants/interview';
import { useState } from 'react';

interface SidebarProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

export default function Sidebar({ 
  selectedRole, 
  setSelectedRole, 
  difficulty, 
  setDifficulty 
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    roleCategories.map(c => c.category)
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="w-64 shrink-0">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 px-4 mb-2">
          面試難度
        </h3>
        <div className="flex flex-col gap-1">
          {difficulties.map(d => (
            <button
              type="button"
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`px-4 py-2.5 rounded-xl text-sm text-left transition-all duration-200 font-medium ${
                difficulty === d.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {roleCategories.map((category) => (
          <div key={category.category} className="space-y-2">
            <button
              type="button"
              onClick={() => toggleCategory(category.category)}
              className="w-full px-4 py-1 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>{category.category}</span>
              <span className="transform transition-transform duration-200">
                {expandedCategories.includes(category.category) ? '▼' : '▶'}
              </span>
            </button>
            {expandedCategories.includes(category.category) && (
              <div className="flex flex-col gap-1">
                {category.roles.map(role => (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm text-left transition-all duration-200 font-medium ${
                      selectedRole === role.id
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 