import { create } from 'zustand';

const useJobStore = create((set) => ({
  jobs: [
    { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', category: 'engineering', description: 'React and Node.js skills needed.', matchScore: 92, postedAt: '2 days ago' },
    { id: 2, title: 'Product Manager', company: 'InnovateInc', location: 'New York, NY', category: 'product', description: 'Lead cross-functional teams to build great products.', matchScore: 85, postedAt: '5 hours ago' },
    { id: 3, title: 'UX Designer', company: 'DesignStudio', location: 'London, UK', category: 'design', description: 'Create beautiful and intuitive user experiences.', matchScore: 78, postedAt: '1 day ago' },
    { id: 4, title: 'Data Scientist', company: 'DataWorks', location: 'Remote', category: 'data', description: 'Analyze complex datasets and build ML models.', matchScore: 95, postedAt: '3 days ago' },
  ],
  filteredJobs: [
    { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', category: 'engineering', description: 'React and Node.js skills needed.', matchScore: 92, postedAt: '2 days ago' },
    { id: 2, title: 'Product Manager', company: 'InnovateInc', location: 'New York, NY', category: 'product', description: 'Lead cross-functional teams to build great products.', matchScore: 85, postedAt: '5 hours ago' },
    { id: 3, title: 'UX Designer', company: 'DesignStudio', location: 'London, UK', category: 'design', description: 'Create beautiful and intuitive user experiences.', matchScore: 78, postedAt: '1 day ago' },
    { id: 4, title: 'Data Scientist', company: 'DataWorks', location: 'Remote', category: 'data', description: 'Analyze complex datasets and build ML models.', matchScore: 95, postedAt: '3 days ago' },
  ],
  searchQuery: '',
  selectedCategory: 'all',
  skillResults: null,
  careerSimulation: null,
  loading: false,

  setJobs: (jobs) => set({ jobs, filteredJobs: jobs }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSkillResults: (results) => set({ skillResults: results }),
  setCareerSimulation: (simulation) => set({ careerSimulation: simulation }),
  setLoading: (loading) => set({ loading }),

  filterJobs: () => {
    set((state) => {
      let filtered = state.jobs;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(j => 
          j.title?.toLowerCase().includes(q) || 
          j.description?.toLowerCase().includes(q)
        );
      }
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(j => j.category === state.selectedCategory);
      }
      return { filteredJobs: filtered };
    });
  }
}));

export default useJobStore;
