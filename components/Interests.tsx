'use client'
import { useState } from 'react'
const ALL = ['Temples','Architecture','Vegetarian Food','Museums','Shopping']
export default function Interests() {
  const [sel, setSel] = useState<string[]>([])
  return (
    <div className="flex flex-wrap gap-2">
      {ALL.map(tag => (
        <label key={tag} className={`px-3 py-1 rounded-full border cursor-pointer ${sel.includes(tag)?'bg-slate-900 text-white':'bg-white'}`}>
          <input type="checkbox" name="interests" value={tag} className="hidden"
                onChange={(e)=> setSel(s=> e.target.checked? [...s, tag] : s.filter(x=>x!==tag))}/>
          {tag}
        </label>
      ))}
    </div>
  )
}
