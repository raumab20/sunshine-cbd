import type React from "react"

interface DescriptionComponentProps {
  title: string
  description: string
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({ title, description }) => {
  return (
    <div className="w-full min-h-[16rem] bg-[#4F7942] flex items-center justify-center py-4 sm:p-6 md:p-8">
      <div style={{ background: 'var(--background)' }} className="opacity-95 p-4 sm:p-5 md:p-6 rounded-lg shadow-sm max-w-2xl w-full">
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 md:mb-4">
          {title}
        </h2>
        <p className="text-gray-100 text-sm sm:text-base md:text-lg text-center">{description}</p>
      </div>
    </div>
  )
}

export default DescriptionComponent

