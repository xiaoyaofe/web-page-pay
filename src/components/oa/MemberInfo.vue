<template>
  <div class="oa-member-info">
    <div v-if="store.user">
      <div class="top-row">
        <span class="userid"> {{store.user.userid}} </span>
        <span class="position">{{store.user.position}}</span>
      </div>

      <img
        class="avatar"
        :src="store.user.avatar"
      >

    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { OA_CONST } from '../../../apollo-server/utils/const'
import { getParameterByName } from '@/utils/fns'
import { OA, APOLLO } from 'types';
import gql from 'graphql-tag'
import { user_info } from 'apollo-server/utils/db';

let sql = require('@/graphql/oa.gql')
@Component<MemberInfo>({
  mounted() {

  },
  apollo: {
    accessToken: {
      query: gql`query accessToken {
        oa(options: {
          name: ${OA_CONST.QUERY.ACCESS_TOKEN}
        }) 
      }`,
      update: function (res: OA.Res<string>) {
        this.$set(this.store, OA_CONST.QUERY.ACCESS_TOKEN, res.oa)
        this.$apollo.mutate({
          mutation: sql.userInfo,
          variables: {
            data: {
              access_token: this.store.accessToken,
              code: getParameterByName('code')
            }
          },
          update: (store, res: APOLLO.ServerRes<OA.Res<OA.USER.UserInfoRes>>) => {
            const userid = res.data.oa.UserId
            this.$apollo.mutate({
              mutation: sql.user,
              variables: {
                data: {
                  access_token: this.store.accessToken,
                  userid
                }
              },
              update: (store, res: APOLLO.ServerRes<OA.Res<OA.USER.UserRes>>) => {
                this.$set(this.store, OA_CONST.QUERY.USER, res.data.oa)
              },
            })
          },
        })


      }
    },
  }
})

export default class MemberInfo extends Vue {
  /** this data store */
  store = {} as {
    accessToken: string
    user: OA.USER.User
  }


}
</script>

<style lang="scss">
// $oa_user_management_width: 1200px;
// $department_list_width: 260px;
// $user_list_width: $oa_user_management_width - $department_list_width - 100;
.oa-member-info {
  font-family: "Raleway", sans-serif;
  width: 1000px;
  margin: 0 auto;
  // background: red;
  .top-row {
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 40px 0;
    .userid {
      text-transform: uppercase;
      letter-spacing: 4px;
      font-size: 50px;
    }
    .position {
      margin: -15px 0 0 0;
      font-size: 14px;
      letter-spacing: 10px;
    }
  }
  .avatar {
    width: 200px;
    height: 200px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
