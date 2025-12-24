import { baseApi } from "../../api/baseApi";

const noticesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotices: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "notice",
          method: "GET",
          params,
        };
      },
      providesTags: ["notice"],
    }),
    storeNotice: builder.mutation({
      query: (payload) => ({
        url: `notice`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["notice"],
    }),
    updateNotice: builder.mutation({
      query: ({ id, payload }) => ({
        url: `notice/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["notice"],
    }),
    // Mark multiple notices as read
    markAsRead: builder.mutation({
      query: (data) => ({
        url: '/notice/mark-read',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Notice'],
    }),
    deleteNotice: builder.mutation({
      query: ({ id }) => ({
        url: `notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notice"],
    }),
  }),
});

export const {
  useGetAllNoticesQuery,
  useStoreNoticeMutation,
  useUpdateNoticeMutation,
  useMarkAsReadMutation,
  useDeleteNoticeMutation
} = noticesApi;

export default noticesApi;
