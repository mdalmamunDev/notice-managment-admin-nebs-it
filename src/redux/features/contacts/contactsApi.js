import { baseApi } from "../../api/baseApi";

const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllContacts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "contact",
          method: "GET",
          params,
        };
      },
      providesTags: ["contact"],
    }),
    storeContact: builder.mutation({
      query: (payload) => ({
        url: `contact`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["contact"],
    }),
    updateContact: builder.mutation({
      query: ({ id, payload }) => ({
        url: `contact/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["contact"],
    }),
    // Mark multiple contacts as read
    markAsRead: builder.mutation({
      query: (data) => ({
        url: '/contact/mark-read',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),
    deleteContact: builder.mutation({
      query: ({ id }) => ({
        url: `contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useStoreContactMutation,
  useUpdateContactMutation,
  useMarkAsReadMutation,
  useDeleteContactMutation
} = contactsApi;

export default contactsApi;
