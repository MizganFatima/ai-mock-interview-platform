const mongoose = require('mongoose');

const ReadinessReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    overallScore: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ['Placement Ready', 'Needs Improvement', 'High Potential Candidate'], 
        required: true 
    },
    candidateType: { 
        type: String, 
        enum: ['fresher', 'internship_seeker', 'experienced'], 
        default: 'internship_seeker' 
    },
    weakAreas: [{ type: String }],
    communicationGaps: [{ type: String }],
    missingSkills: [{ type: String }],
    roadmap: {
        recommendedTechnologies: [{ type: String }],
        suggestedProjects: [{ type: String }],
        certifications: [{ type: String }],
        interviewTopics: [{ type: String }]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReadinessReport', ReadinessReportSchema);