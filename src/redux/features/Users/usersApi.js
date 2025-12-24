import { baseApi } from "../../api/baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "user",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    getAllAdmin: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          // Use the dynamic query parameters provided by the caller
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "user/admin",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    getProvider: builder.query({
      query: (userId) => {
        return {
          url: `tow-truck/${userId}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    getPendingRequest: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "user/verification-status",
          method: "GET",
          params,
        };
      },
      providesTags: ["user"],
    }),
    acceptVerification: builder.mutation({
      query: ({ id, isVerified }) => ({
        url: `/tow-truck/verify/${id}`,
        method: "PUT",
        body: {isVerified}
      }),
      invalidatesTags: ["user"],
    }),
    adminNotification: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            params.append(key, value);
          });
        }
        return {
          url: "notification",
          method: "GET",
          params,
        };
      },
      providesTags: ["transaction", "user"],
    }),
    // adminNotificationBadge: builder.query({
    //   query: () => ({
    //     url: "notification/badge-count",
    //     method: "GET",
    //   }),
    // }),
    // New endpoint for manager approval/deny
    managerApproveDeny: builder.mutation({
      query: ({ id, status }) => ({
        url: `auth/approve-deny?id=${id}&status=${status}`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: ({ id, payload }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: payload
      }),
      invalidatesTags: ["user"],
    }),
    addAdmin: builder.mutation({
      query: ( payload ) => ({
        url: `user/admin`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["user"],
    }),
    updateAdmin: builder.mutation({
      query: ( {userId, status, role} ) => ({
        url: `user/admin/${userId}`,
        method: "PUT",
        body: {status, role}
      }),
      invalidatesTags: ["user"],
    }),
    deleteAdmin: builder.mutation({
      query: ( id ) => ({
        url: `user/admin/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetAllAdminQuery,
  useGetProviderQuery,
  useGetPendingRequestQuery,
  useAcceptVerificationMutation,
  useManagerApproveDenyMutation, // New hook for the approval/deny action
  useAdminNotificationQuery,
  // useAdminNotificationBadgeQuery,
  useUpdateUserMutation,
  useAddAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = usersApi;

export default usersApi;
