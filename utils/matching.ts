export const calculateMatchPercentage = (
  candidateSkills: string[],
  requiredSkills: string[],
  candidateExperience: number,
  minExperience: number,
  maxExperience: number
): number => {
  if (!candidateSkills || !requiredSkills) return 0

  // Skills matching (70% weight)
  let skillsMatchScore = 0
  if (requiredSkills.length > 0) {
    const matchingSkills = candidateSkills.filter(skill =>
      requiredSkills.some(required =>
        skill.toLowerCase().includes(required.toLowerCase()) ||
        required.toLowerCase().includes(skill.toLowerCase())
      )
    )
    skillsMatchScore = Math.min((matchingSkills.length / requiredSkills.length) * 100, 100)
  } else {
    skillsMatchScore = 100
  }

  // Experience matching (30% weight)
  let experienceMatchScore = 0
  if (candidateExperience >= minExperience && candidateExperience <= maxExperience) {
    experienceMatchScore = 100
  } else if (candidateExperience < minExperience) {
    experienceMatchScore = Math.max(0, 100 - (minExperience - candidateExperience) * 20)
  } else {
    experienceMatchScore = Math.max(0, 100 - (candidateExperience - maxExperience) * 10)
  }

  // Calculate weighted total
  const totalScore = (skillsMatchScore * 0.7 + experienceMatchScore * 0.3)
  
  return Math.round(Math.min(totalScore, 100))
}

export const getMatchColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-600 bg-green-100'
  if (percentage >= 80) return 'text-yellow-600 bg-yellow-100'
  if (percentage >= 70) return 'text-orange-600 bg-orange-100'
  return 'text-red-600 bg-red-100'
}

export const getMatchLabel = (percentage: number): string => {
  if (percentage >= 90) return 'Excellent Match'
  if (percentage >= 80) return 'Good Match'
  if (percentage >= 70) return 'Fair Match'
  return 'Poor Match'
}