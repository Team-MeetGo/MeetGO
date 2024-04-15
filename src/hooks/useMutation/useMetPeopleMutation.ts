import { requestKakaoId, updateRequestStatus } from '@/service';
import { useMutation } from '@tanstack/react-query';

export const useMetPeopleMutation = () =>
  useMutation({
    mutationFn: ({ requestId, responseId }: { requestId: string; responseId: string }) =>
      requestKakaoId(requestId, responseId)
  });

export const useAcceptKakaoIdMutation = () =>
  useMutation({
    mutationFn: ({ requestId, responseId, newStatus }: { requestId: string; responseId: string; newStatus: string }) =>
      updateRequestStatus(requestId, responseId, newStatus)
  });
