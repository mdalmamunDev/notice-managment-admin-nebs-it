import { baseApi } from "../../api/baseApi";

const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "subscription",
          method: "GET",
          params,
        };
      },
      providesTags: ["subscription"],
    }),
    storeSubscription: builder.mutation({
      query: (payload) => ({
        url: `subscription`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["subscription"],
    }),
    updateSubscription: builder.mutation({
      query: ({ id, payload }) => ({
        url: `subscription/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["subscription"],
    }),
    deleteSubscription: builder.mutation({
      query: ({ id }) => ({
        url: `subscription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useStoreSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation
} = subscriptionsApi;

export default subscriptionsApi;
