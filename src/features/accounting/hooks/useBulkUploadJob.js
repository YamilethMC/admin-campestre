import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountStatementService } from '../services';

/**
 * Hook to track bulk upload job status with React Query
 * @param {string|null} jobId - The job ID to track
 * @param {Object} options - Additional options
 * @returns {Object} Job status data and controls
 */
export const useBulkUploadJobStatus = (jobId, options = {}) => {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ['bulkUploadJob', jobId],
    queryFn: () => accountStatementService.getJobStatus(jobId),
    enabled: Boolean(jobId) && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling if job is completed or failed
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
        return false;
      }
      // Poll every 3 seconds while processing
      return 3000;
    },
    staleTime: 1000,
  });

  const progressPercent = query.data?.totalFiles > 0
    ? Math.round((query.data.processed / query.data.totalFiles) * 100)
    : 0;

  const isProcessing = query.data?.status === 'PROCESSING';
  const isPending = query.data?.status === 'PENDING';
  const isCompleted = query.data?.status === 'COMPLETED';
  const isFailed = query.data?.status === 'FAILED';
  const isActive = isPending || isProcessing;

  return {
    ...query,
    jobId,
    status: query.data?.status,
    totalFiles: query.data?.totalFiles || 0,
    processed: query.data?.processed || 0,
    failed: query.data?.failed || 0,
    errors: query.data?.errors || [],
    progressPercent,
    isProcessing,
    isPending,
    isCompleted,
    isFailed,
    isActive,
  };
};

/**
 * Hook to get recent bulk upload jobs
 * @returns {Object} Recent jobs data and controls
 */
export const useRecentBulkJobs = () => {
  return useQuery({
    queryKey: ['recentBulkJobs'],
    queryFn: () => accountStatementService.getRecentJobs(),
    staleTime: 10000,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

/**
 * Hook to upload account statements and track job
 * @returns {Object} Upload mutation and job tracking
 */
export const useBulkUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => accountStatementService.uploadAccountStatements(file),
    onSuccess: () => {
      // Invalidate recent jobs query to refresh list
      queryClient.invalidateQueries({ queryKey: ['recentBulkJobs'] });
    },
  });
};
