<template>
  <el-row class="order-management" type="flex" justify="center">
    <el-card class="main">

      <el-tabs v-model="version" type="card" @tab-click="ChangeVersion">
        <el-tab-pane v-for="(value, name) in translation.tabs" :key="name" :label="value" :name="name">

          <template v-if="Version1()">

            <el-row class="mt-16" type="flex" justify="center" align="middle">
              <span class="mr-16">{{translation.text.transactionId}}</span>
              <el-input class="mr-16" clearable v-model="transactionId" @change="ChangeTransactionId"></el-input>
              <ApolloMutation :mutation="require('@/graphql/OrderManagement.gql').Verify" @done="DoneOfVerify">
                <template slot-scope="{ mutate }">
                  <el-button @click="QueryTransactionId(mutate)" >
                    查询
                  </el-button>
                </template>
              </ApolloMutation>
            </el-row>

            <el-row>
              <iv-divider></iv-divider>
            </el-row>

            <ApolloQuery :query="require('@/graphql/OrderManagement.gql').AppInfos" :variables="{version: '1'}" :class="RequiredCheck()" @result="DoneOfAppInfos">
              <template slot-scope="{ result: { data } }">
                <!-- 用户 ID -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.userId}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.userId" disabled></el-input>
                    <el-input v-else v-model="userId" :placeholder="(querying && !userId && translation.notification.noUserId) || translation.placeholder.userId" clearable></el-input>
                  </el-col>
                </el-row>

                <!-- 角色 ID -->
                <!-- <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.roleId}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.roleId" disabled></el-input>
                    <el-input v-else v-model="roleId" :placeholder="(querying && !roleId && translation.notification.noRoleId) || translation.placeholder.roleId" clearable></el-input>
                  </el-col>
                </el-row> -->

                <!-- AppId -->
                <el-row v-if="appInfos" class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.appId}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="`${verifyData.data.orderInfo.appId} - ${appInfos[verifyData.data.orderInfo.appId] ? appInfos[verifyData.data.orderInfo.appId].appName : ''}`" disabled></el-input>
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').AdvChannels" @done="DoneOfAppId">
                      <template slot-scope="{ mutate }">
                        <el-select v-model="appId" clearable filterable :placeholder="translation.placeholder.appId" @change="
                        ChangeAppId(mutate)">
                          <el-option v-for="(item, appId) in appInfos" :key="appId" :label="`${appId} - ${item.appName}`" :value="Number(appId)">
                          </el-option>
                        </el-select>
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row>

                <!-- 游戏区服 -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.gameZone}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="`${appInfos[verifyData.data.orderInfo.appId] ? appInfos[verifyData.data.orderInfo.appId].gameZones[verifyData.data.orderInfo.gameZoneId]? appInfos[verifyData.data.orderInfo.appId].gameZones[verifyData.data.orderInfo.gameZoneId].zoneName : verifyData.data.orderInfo.gameZoneId : verifyData.data.orderInfo.gameZoneId}`" disabled />

                    <el-select v-else-if="appId" v-model="gameZoneId" clearable filterable :placeholder="translation.placeholder.gameZone">
                      <el-option v-for="(item, unique) in appInfos[appId].gameZones" :key="unique" :label="`${item.gameZoneId} - ${item.zoneName}`" :value="item.gameZoneId">
                      </el-option>
                    </el-select>

                    <el-select v-else v-model="gameZoneId" :placeholder="translation.placeholder.gameZone" clearable />
                  </el-col>
                </el-row>

                <!-- advChannel -->
                <!-- <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.advChannel}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.advChannel" disabled />
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').PayChannels" @done="DoneOfAdvChannel">
                      <template slot-scope="{ mutate }">
                        <el-select v-if="appId" v-model="advChannel" clearable filterable :placeholder="translation.placeholder.advChannel" @change="
                    ChangeAdvChannel(mutate)">
                          <el-option v-for="(item, index) in advChannels" :key="index" :label="`${item.advChannel} - ${item.advChannelName}`" :value="item.advChannel">
                          </el-option>
                        </el-select>
                        <el-select v-else :placeholder="translation.placeholder.advChannel" v-model="advChannel" clearable />
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row> -->

                <!-- 支付渠道 -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.payChannel}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.payWay" disabled></el-input>
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').PayWays" @done="DoneOfPayChannel">
                      <template slot-scope="{ mutate }">
                        <el-select v-if="payChannels.length" v-model="payChannel" clearable filterable :placeholder="translation.placeholder.payChannel" @change="ChangePayChannel(mutate)">
                          <el-option v-for="item in payChannels" :key="`${appId}-${item.channelId}`" :label="`${item.channelId} - ${item.channelName}`" :value="item.channelId">
                          </el-option>
                        </el-select>
                        <el-select v-else v-model="payChannel" :placeholder="translation.placeholder.payChannel">
                        </el-select>
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row>

                <!-- 支付方式 -->
                <!-- <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.payWay}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.cardCode" disabled></el-input>
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').Products" @done="DoneOfPayWay">
                      <template slot-scope="{ mutate }">
                        <el-select v-if="payWays.length" v-model="payWay" clearable filterable :placeholder="translation.placeholder.payWay" @change="ChangePayWay(mutate)">
                          <el-option v-for="item in payWays" :key="`${appId}-${item.cardCode}`" :label="`${item.cardCode} - ${item.cardCodeName}`" :value="item.cardCode">
                          </el-option>
                        </el-select>
                        <el-select v-else v-model="payWay" :placeholder="translation.placeholder.payWay">
                        </el-select>
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row> -->

                <!-- 选择商品 -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.product}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                     <el-select v-if="verifyData && verifyData.code === 200" v-model="product" clearable filterable :placeholder="translation.placeholder.product">
                      <el-option v-for="item in verifyData.data.products" :key="item.goodsId" :label="`${item.goodsPrice}/${item.currency} - ${item.goodsName}`" :value="item.goodsId">
                      </el-option>
                    </el-select>
                    <el-select v-else-if="verifyData && verifyData.code === 201" v-model="product" clearable filterable :placeholder="translation.placeholder.product">
                      <el-option v-for="item in verifyData.data.productInfoList" :key="item.goodsId" :label="`${item.goodsPrice}/${item.currency} - ${item.goodsName}`" :value="item.goodsId">
                      </el-option>
                    </el-select>
                    <el-select v-else-if="products.length" v-model="product" clearable filterable :placeholder="translation.placeholder.product">
                      <el-option v-for="item in products" :key="item.goodsId" :label="`${item.goodsPrice}/${item.currency} - ${item.goodsName}`" :value="item.goodsId">
                      </el-option>
                    </el-select>
                    <el-select v-else v-model="product" :placeholder="translation.placeholder.product">
                    </el-select>
                  </el-col>
                </el-row>
              </template>
            </ApolloQuery>

            <el-row class="mt-16 mb-16" type="flex" justify="center">
              <ApolloMutation :mutation="require('@/graphql/OrderManagement.gql').Repair" @done="DoneOfRepair">
                <template slot-scope="{ mutate }">
                  <el-button @click="CheckRequired(mutate)" style="width: 256px; margin-top: 25px;">{{translation.text.submit}}</el-button>
                </template>
              </ApolloMutation>
            </el-row>

          </template>

          <template v-else>

            <el-row class="mt-16" type="flex" justify="center" align="middle">
              <span class="mr-16">{{translation.text.transactionId}}</span>
              <el-input class="mr-16" clearable v-model="transactionId" @change="ChangeTransactionId"></el-input>
              <ApolloMutation :mutation="require('@/graphql/OrderManagement.gql').Verify" @done="DoneOfVerify">
                <template slot-scope="{ mutate }">
                  <el-button @click="QueryTransactionId(mutate)" >
                    查询
                  </el-button>
                </template>
              </ApolloMutation>
            </el-row>

            <el-row>
              <iv-divider></iv-divider>
            </el-row>

            <ApolloQuery :query="require('@/graphql/OrderManagement.gql').AppInfos" :variables="{version: '2'}" :class="RequiredCheck()" @result="DoneOfAppInfos">
              <template slot-scope="{ result: { data } }">
                <!-- 用户 ID -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.userId}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.userId" disabled></el-input>
                    <el-input v-else v-model="userId" :placeholder="(querying && !userId && translation.notification.noUserId) || translation.placeholder.userId" clearable></el-input>
                  </el-col>
                </el-row>

                <!-- 角色 ID -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.roleId}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.roleId" disabled></el-input>
                    <el-input v-else v-model="roleId" :placeholder="(querying && !roleId && translation.notification.noRoleId) || translation.placeholder.roleId" clearable></el-input>
                  </el-col>
                </el-row>

                <!-- AppId -->
                <el-row v-if="appInfos" class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.appId}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="`${verifyData.data.orderInfo.appId} - ${appInfos[verifyData.data.orderInfo.appId] ? appInfos[verifyData.data.orderInfo.appId].appName : ''}`" disabled></el-input>
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').AdvChannels" @done="DoneOfAppId">
                      <template slot-scope="{ mutate }">
                        <el-select v-model="appId" clearable filterable :placeholder="translation.placeholder.appId" @change="
                      ChangeAppId(mutate)">
                          <el-option v-for="(item, appId) in appInfos" :key="appId" :label="`${appId} - ${item.appName}`" :value="Number(appId)">
                          </el-option>
                        </el-select>
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row>

                <!-- 游戏区服 -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.gameZone}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="`${appInfos[verifyData.data.orderInfo.appId] ? appInfos[verifyData.data.orderInfo.appId].gameZones[verifyData.data.orderInfo.thirdGameZoneId]? appInfos[verifyData.data.orderInfo.appId].gameZones[verifyData.data.orderInfo.thirdGameZoneId].zoneName : verifyData.data.orderInfo.thirdGameZoneId : verifyData.data.orderInfo.thirdGameZoneId}`" disabled />

                    <el-select v-else-if="appId" v-model="gameZoneId" clearable filterable :placeholder="translation.placeholder.gameZone">
                      <el-option v-for="(item, unique) in appInfos[appId].gameZones" :key="unique" :label="`${item.thirdGameZoneId} - ${item.zoneName}`" :value="item.thirdGameZoneId">
                      </el-option>
                    </el-select>

                    <el-select v-else v-model="gameZoneId" :placeholder="translation.placeholder.gameZone" clearable />
                  </el-col>
                </el-row>

                <!-- advChannel -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.advChannel}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.advChannel" disabled />
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').PayChannels" @done="DoneOfAdvChannel">
                      <template slot-scope="{ mutate }">
                        <el-select v-if="appId" v-model="advChannel" clearable filterable :placeholder="translation.placeholder.advChannel" @change="
                    ChangeAdvChannel(mutate)">
                          <el-option v-for="(item, index) in advChannels" :key="index" :label="`${item.advChannel} - ${item.advChannelName}`" :value="item.advChannel">
                          </el-option>
                        </el-select>
                        <el-select v-else :placeholder="translation.placeholder.advChannel" v-model="advChannel" clearable />
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row>

                <!-- 支付渠道 -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.payChannel}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.channel" disabled></el-input>
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').PayWays" @done="DoneOfPayChannel">
                      <template slot-scope="{ mutate }">
                        <el-select v-if="payChannels.length" v-model="payChannel" clearable filterable :placeholder="translation.placeholder.payChannel" @change="ChangePayChannel(mutate)">
                          <el-option v-for="item in payChannels" :key="`${appId}-${item.channelId}`" :label="`${item.channelId} - ${item.channelName}`" :value="item.channelId">
                          </el-option>
                        </el-select>
                        <el-select v-else v-model="payChannel" :placeholder="translation.placeholder.payChannel">
                        </el-select>
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row>

                <!-- 支付方式 -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.payWay}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-input v-if="verifyData" :value="verifyData.data.orderInfo.cardCode" disabled></el-input>
                    <ApolloMutation v-else :mutation="require('@/graphql/OrderManagement.gql').Products" @done="DoneOfPayWay">
                      <template slot-scope="{ mutate }">
                        <el-select v-if="payWays.length" v-model="payWay" clearable filterable :placeholder="translation.placeholder.payWay" @change="ChangePayWay(mutate)">
                          <el-option v-for="item in payWays" :key="`${appId}-${item.cardCode}`" :label="`${item.cardCode} - ${item.cardCodeName}`" :value="item.cardCode">
                          </el-option>
                        </el-select>
                        <el-select v-else v-model="payWay" :placeholder="translation.placeholder.payWay">
                        </el-select>
                      </template>
                    </ApolloMutation>
                  </el-col>
                </el-row>

                <!-- 选择商品 -->
                <el-row class="mb-16" type="flex" align="middle" justify="center">
                  <el-col :sm="2">
                    <el-row type="flex" justify="center">{{translation.text.product}}</el-row>
                  </el-col>
                  <el-col :sm="10">
                    <el-select v-if="verifyData && verifyData.code === 200" v-model="product" clearable filterable :placeholder="translation.placeholder.product">
                      <el-option v-for="item in verifyData.data.products" :key="item.productId" :label="`${item.amount}/${item.currency} - ${item.productName}`" 
                      :value="getProductName(item)">
                      </el-option>
                    </el-select>
                    <el-select v-else-if="verifyData && verifyData.code === 201" v-model="product" clearable filterable :placeholder="translation.placeholder.product">
                      <el-option v-for="item in verifyData.data.productInfoList" :key="item.productId" :label="`${item.amount}/${item.currency} - ${item.productName}`" :value="getProductName(item)">
                      </el-option>
                    </el-select>
                    <el-select v-else-if="products.length" v-model="product" clearable filterable :placeholder="translation.placeholder.product">
                      <el-option v-for="item in products" :key="item.productId" :label="`${item.amount}/${item.currency} - ${item.productName}`" :value="getProductName(item)">
                      </el-option>
                    </el-select>
                    <el-select v-else v-model="product" :placeholder="translation.placeholder.product">
                    </el-select>
                  </el-col>
                </el-row>
              </template>
            </ApolloQuery>

            <el-row class="mt-16 mb-16" type="flex" justify="center">
              <ApolloMutation :mutation="require('@/graphql/OrderManagement.gql').Repair" @done="DoneOfRepair">
                <template slot-scope="{ mutate }">
                  <el-button @click="CheckRequired(mutate)" style="width: 256px; margin-top: 25px;">{{translation.text.submit}}</el-button>
                </template>
              </ApolloMutation>
            </el-row>
          </template>

        </el-tab-pane>
      </el-tabs>
    </el-card>

  </el-row>
</template>
<style lang="scss">

.order-management {
  height: 100%;
  .main {
    width: 1000px;
    margin-top: 16px;
  }
  .querying input::placeholder {
    color: red !important;
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266 !important;
  }
  .el-select,
  .el-input {
    width: 100%;
    max-width: 305px;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Notification, version } from "element-ui";

/** 常量 */
const EMPTY_STRING: string = "";
const VER_1: string = "v1";
const VER_2: string = "v2";

@Component<OrderManagement>({
  computed: {
    transactionId: {
      set(val) {
        this._data._transactionId[this.version] = val;
      },
      get() {
        return this._data._transactionId[this.version];
      }
    },
    verifiedId: {
      get() {
        return this._data._verifiedId[this.version];
      },
      set(val) {
        this._data._verifiedId[this.version] = val;
      }
    },
    transactionIdRendered: {
      get() {
        return this._data._transactionIdRendered[this.version];
      },
      set(val) {
        this._data._transactionIdRendered[this.version] = val;
      }
    },
    appInfos: {
      get() {
        return this._data._appInfos[this.version];
      },
      set(val) {
        this._data._appInfos[this.version] = val;
      }
    },
    verifyData: {
      get() {
        return this._data._verifyData[this.version];
      },
      set(val) {
        this._data._verifyData[this.version] = val;
      }
    },
    userId: {
      get() {
        return this._data._userId[this.version];
      },
      set(val) {
        this._data._userId[this.version] = val;
      }
    },
    roleId: {
      get() {
        return this._data._roleId[this.version];
      },
      set(val) {
        this._data._roleId[this.version] = val;
      }
    },
    appId: {
      get() {
        return this._data._appId[this.version];
      },
      set(val) {
        this._data._appId[this.version] = val;
      }
    },
    gameZoneId: {
      get() {
        return this._data._gameZoneId[this.version];
      },
      set(val) {
        this._data._gameZoneId[this.version] = val;
      }
    },
    advChannel: {
      get() {
        return this._data._advChannel[this.version];
      },
      set(val) {
        this._data._advChannel[this.version] = val;
      }
    },
    advChannels: {
      get() {
        return this._data._advChannels[this.version];
      },
      set(val) {
        this._data._advChannels[this.version] = val;
      }
    },
    payChannel: {
      get() {
        return this._data._payChannel[this.version];
      },
      set(val) {
        this._data._payChannel[this.version] = val;
      }
    },
    payChannels: {
      get() {
        return this._data._payChannels[this.version];
      },
      set(val) {
        this._data._payChannels[this.version] = val;
      }
    },
    payWay: {
      get() {
        return this._data._payWay[this.version];
      },
      set(val) {
        this._data._payWay[this.version] = val;
      }
    },
    payWays: {
      get() {
        return this._data._payWays[this.version];
      },
      set(val) {
        this._data._payWays[this.version] = val;
      }
    },
    product: {
      get() {
        return this._data._product[this.version];
      },
      set(val) {
        this._data._product[this.version] = val;
      }
    },
    productName: {
      get() {
        return this._data._productName[this.version];
      },
      set(val) {
        this._data._productName[this.version];
      }
    },
    products: {
      get() {
        return this._data._products[this.version];
      },
      set(val) {
        this._data._products[this.version] = val;
      }
    },
    querying: {
      get() {
        return this._data._querying[this.version];
      },
      set(val) {
        this._data._querying[this.version] = val;
      }
    }
  },
  mounted() {
    const OrderManagement = this;
    window.VueComponents = { ...window.VueComponents, ...{ OrderManagement } };
  
  }
})
export default class OrderManagement extends Vue {
  constructor() {
    super();
  }

  /** 翻译 */
  private translation = {
    tabs: {
      [VER_1]: "订单管理v1.0",
      [VER_2]: "订单管理v2.0"
    },
    text: {
      transactionId: "订单 ID" + "：",
      userId: "用户 ID" + "：",
      roleId: "角色 ID" + "：",
      appId: "App ID" + "：",
      gameZone: "游戏区服" + "：",
      advChannel: "包渠道" + "：",
      payChannel: "支付渠道" + "：",
      payWay: "支付方式" + "：",
      product: "选择商品" + "：",
      submit: "提交"
    },
    placeholder: {
      userId: "请填写用户ID",
      roleId: "请填写角色ID",
      appId: "请选择相关游戏",
      gameZone: "请选择相关区服",
      advChannel: "请选择相关包渠道",
      payChannel: "请选择相关支付渠道",
      payWay: "请选择相关支付方式",
      product: "请选择相关商品"
    },
    notification: {
      noUserId: "用户ID不能为空",
      noRoleId: "角色ID不能为空",
      wrongUserId: "用户ID不正确",
      wrongRoleId: "角色ID不正确"
    }
  };
  /** el-tabs: v-model */
  private version = VER_1;
  /** 订单ID */
  private _transactionId: any = {
    [VER_1]: EMPTY_STRING,
    [VER_2]: EMPTY_STRING
  };
  /** 已查询的订单ID */
  private _verifiedId: any = {
    [VER_1]: EMPTY_STRING,
    [VER_2]: EMPTY_STRING
  };
  private _transactionIdRendered: any = {
    [VER_1]: false,
    [VER_2]: false
  };
  private _appInfos: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _verifyData: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _userId: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _roleId: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _appId: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _gameZoneId: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _advChannel: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _advChannels: any = {
    [VER_1]: [],
    [VER_2]: []
  };
  private _payChannel: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _payChannels: any = {
    [VER_1]: [],
    [VER_2]: []
  };
  private _payWay: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _payWays: any = {
    [VER_1]: [],
    [VER_2]: []
  };
  private _product: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _productName: any = {
    [VER_1]: undefined,
    [VER_2]: undefined
  };
  private _products: any = {
    [VER_1]: [],
    [VER_2]: []
  };
  private _querying: any = {
    [VER_1]: false,
    [VER_2]: false
  };

  private _data: OrderManagement = undefined as any;

  /** ifs */
  Version1() {
    return this.version === VER_1;
  }
  /** class */
  RequiredCheck() {
    return this._data._querying[this.version] && "querying";
  }
  /** Changes */
  ChangeVersion(tab, event) {
    console.log(tab, event);
  }

  ChangeTransactionId(val) {
    if (!val && this._data._transactionIdRendered[this.version]) {
      this._data._transactionIdRendered[this.version] = false;
      this._data._verifyData[this.version] = undefined;
      this._data._userId[this.version] = undefined;
      this._data._roleId[this.version] = undefined;
      this._data._appId[this.version] = undefined;
      this._data._gameZoneId[this.version] = undefined;
      this._data._advChannel[this.version] = undefined;
      this._data._advChannels[this.version] = [];
      this._data._payChannel[this.version] = undefined;
      this._data._payChannels[this.version] = [];
      this._data._payWay[this.version] = undefined;
      this._data._payWays[this.version] = [];
      this._data._product[this.version] = undefined;
      this._data._productName[this.version] = undefined;
      this._data._products[this.version] = [];
    }
  }

  ChangeAppId(mutate) {
    this._data._gameZoneId[this.version] = undefined;
    this._data._advChannel[this.version] = undefined;
    this._data._advChannels[this.version] = [];
    this._data._payChannel[this.version] = undefined;
    this._data._payChannels[this.version] = [];
    this._data._payWay[this.version] = undefined;
    this._data._payWays[this.version] = [];
    this._data._product[this.version] = undefined;
    this._data._productName[this.version] = undefined;
    this._data._products[this.version] = [];

    this._data._appId[this.version] &&
      mutate({
        variables:
          this.version === VER_1
            ? {
                version: "1",
                data: {
                  confId: this._data._appInfos[this.version][
                    this._data._appId[this.version]
                  ].confId
                }
              }
            : {
                version: "2",
                data: {
                  appId: this._data._appId[this.version]
                }
              }
      });
  }

  ChangeAdvChannel(mutate) {
    this._data._payChannel[this.version] = undefined;
    this._data._payChannels[this.version] = [];
    this._data._payWay[this.version] = undefined;
    this._data._payWays[this.version] = [];
    this._data._product[this.version] = undefined;
    this._data._productName[this.version] = undefined;
    this._data._products[this.version] = [];
    String(this._data._advChannel[this.version]) &&
      mutate({
        variables: {
          version: "2",
          data: {
            appId: this._data._appId[this.version],
            advChannel: this._data._advChannel[this.version]
          }
        }
      });
  }

  ChangePayChannel(mutate) {
    this._data._payWay[this.version] = undefined;
    this._data._payWays[this.version] = [];
    this._data._productName[this.version] = undefined;
    this._data._product[this.version] = undefined;
    this._data._products[this.version] = [];
    String(this._data._payChannel[this.version]) &&
      mutate({
        variables:
          this.version === VER_1
            ? {
                version: "1",
                data: {
                  confId: this._data._appInfos[this.version][
                    this._data._appId[this.version]
                  ].confId,
                  channelId: this._data._payChannel[this.version]
                }
              }
            : {
                version: "2",
                data: {
                  appId: this._data._appId[this.version],
                  advChannel: this._data._advChannel[this.version],
                  channelId: this._data._payChannel[this.version]
                }
              }
      });
  }

  ChangePayWay(mutate) {
    this._data._product[this.version] = undefined;
    this._data._products[this.version] = [];
    String(this._data._payWay[this.version]) &&
      mutate({
        variables: {
          version: "2",
          data: {
            appId: this._data._appId[this.version],
            advChannel: this._data._advChannel[this.version],
            channelId: this._data._payChannel[this.version],
            cardCode: this._data._payWay[this.version]
          }
        }
      });
  }

  /**
   * Querys
   */
  QueryTransactionId(mutate) {
    this._data._transactionId[this.version] &&
      mutate({
        variables: {
          version: this.version === VER_1 ? "1" : "2",
          data: {
            transactionId: this._data._transactionId[this.version]
          }
        }
      });
  }

  /** Done */
  DoneOfAppInfos({
    data: {
      get: { code, data }
    }
  }) {
    if (code === 200) {
      this._data._appInfos[this.version] = data.appInfos;
    }
  }

  DoneOfAppId({ data: { post } }) {
    var { code, data, version, message } = post;
    if (code === 200) {
      if (version === "1") {
        this._data._payChannels[VER_1] = data.channels;
      } else if (version === "2") {
        this._data._advChannels[VER_2] = data.advChannels;
      }
    }
  }

  DoneOfAdvChannel({
    data: {
      post: { code, data }
    }
  }) {
    if (code === 200) {
      this._data._payChannels[this.version] = data.channels;
    }
  }

  DoneOfPayChannel({ data: { post } }) {
    var { code, data, version, message } = post;
    if (code === 200) {
      if (version === "1") {
        this._data._products[VER_1] = data.products;
      } else if (version === "2") {
        this._data._payWays[this.version] = data.cardCodes;
      }
    }
  }

  DoneOfPayWay({
    data: {
      post: { code, data }
    }
  }) {
    if (code === 200) {
      this._data._products[this.version] = data.products.sort(
        (a, b) => a.amount - b.amount
      );
    }
  }

  DoneOfVerify({ data: { post } }) {
    if (post) {
      var verifyData: OrderManagement.VerifyDataRes = post;
      if (verifyData.code === 200 || verifyData.code === 201) {
        this._data._verifyData[this.version] = verifyData;
        this._data._product[this.version] = undefined;
        this._data._productName[this.version] = undefined;
        this._data._transactionIdRendered[this.version] = true;
      } else if (verifyData.code === 300) {
        this._data._transactionIdRendered[this.version] = false;
        this._data._verifyData[this.version] = undefined;
        this._data._userId[this.version] = undefined;
        this._data._roleId[this.version] = undefined;
        this._data._appId[this.version] = undefined;
        this._data._gameZoneId[this.version] = undefined;
        this._data._advChannel[this.version] = undefined;
        this._data._advChannels[this.version] = [];
        this._data._payChannel[this.version] = undefined;
        this._data._payChannels[this.version] = [];
        this._data._payWay[this.version] = undefined;
        this._data._payWays[this.version] = [];
        this._data._product[this.version] = undefined;
        this._data._productName[this.version] = undefined;
        this._data._products[this.version] = [];
      } else {
        this._data._verifyData[this.version] = undefined;
      }
      Notification.warning(verifyData.message);
      this._data._verifiedId[this.version] = this._data._transactionId[
        this.version
      ];
    }
  }

  DoneOfRepair({ data: { post } }) {
    if (post.code === 200) {
      this._data._verifiedId[this.version] = this._data._transactionId[
        this.version
      ] = post.data.transactionId;
      this._data._transactionIdRendered[this.version] = true;
    }
    Notification.warning(post.message);
  }

  CheckRequired(mutate) {
    let isThrough = false;
    let options;
    if (this._data._verifyData[this.version]) {
      var { code, data } = this._data._verifyData[this.version];

      if (code === 200) {
        isThrough = true;

        options = {
          appId: data.orderInfo.appId,
          channelId: data.orderInfo.channel,
          userId: data.orderInfo.userId,
          productId: data.orderInfo.productId,
          gameOrderId: data.orderInfo.gameOrderId,
          transactionId: this._data._transactionId[this.version]
        };
        if (this.version === VER_1) {
          options = Object.assign(options, {
            confId: this._data._appInfos[this.version][options.appId].confId,
            channelId: data.orderInfo.payWay,
            gameZoneId: data.orderInfo.gameZoneId
          });
        }

        if (this.version === VER_2) {
          console.log(this._data);
          options = Object.assign(options, {
            advChannel: this._data._verifyData[VER_2].data.orderInfo.advChannel,
            cardCode: this._data._verifyData[VER_2].data.orderInfo.cardCode,
            roleId: this._data._verifyData[VER_2].data.orderInfo.roleId,
            gameZoneId: this._data._verifyData[VER_2].data.orderInfo.gameZoneId,
            productName: this._data._productName[this.version]
          });
        }
      } else if (code === 201 && this._data._product[this.version]) {
        isThrough = true;

        options = {
          appId: data.orderInfo.appId,
          channelId: data.orderInfo.channel,
          userId: data.orderInfo.userId,
          productId: this._data._product[this.version],
          gameOrderId: data.orderInfo.gameOrderId,
          transactionId: this._data._transactionId[this.version]
        };

        if (this.version === VER_1) {
          options = Object.assign(options, {
            confId: this._data._appInfos[this.version][options.appId].confId,
            channelId: data.orderInfo.payWay,
            gameZoneId: data.orderInfo.gameZoneId
          });
        }

        if (this.version === VER_2) {
          options = Object.assign(options, {
            advChannel: this._data._verifyData[VER_2].data.orderInfo.advChannel,
            cardCode: this._data._verifyData[VER_2].data.orderInfo.cardCode,
            roleId: this._data._verifyData[VER_2].data.orderInfo.roleId,
            gameZoneId: this._data._verifyData[VER_2].data.orderInfo.gameZoneId,
            productName: this._data._productName[this.version]
          });
        }
      } else {
        isThrough = false;
      }
    } else if (
      this._data._product[this.version] &&
      this._data._userId[this.version] &&
      (this.version === VER_1 || this._data._roleId[this.version])
    ) {
      if (isNaN(Number(this._data._userId[this.version]))) {
        Notification.warning(this.translation.notification.wrongUserId);
        return false;
      }

      if (
        this.version === VER_2 &&
        isNaN(Number(this._data._roleId[this.version]))
      ) {
        Notification.warning(this.translation.notification.wrongRoleId);
        return false;
      }

      isThrough = true;

      options = {
        appId: this._data._appId[this.version],
        channelId: this._data._payChannel[this.version],
        userId: Number(this._data._userId[this.version]),
        productId: this._data._product[this.version]
      };

      if (this.version === VER_1) {
        options = Object.assign(options, {
          confId: this._data._appInfos[this.version][
            this._data._appId[this.version]
          ].confId,
          gameZoneId: this._data._gameZoneId[this.version]
        });
      }

      if (this.version === VER_2) {
        options = Object.assign(options, {
          advChannel: this._data._advChannel[this.version],
          cardCode: this._data._payWay[this.version],
          roleId: this._data._roleId[this.version],
          gameZoneId: this._data._gameZoneId[this.version],
          productName: this._data._productName[this.version]
        });
      }
    } else {
      isThrough = false;
    }

    if (!isThrough) {
      if (!this._data._querying[this.version]) {
        this._data._querying[this.version] = true;
        (this.CheckRequired as any).setTimeout = setTimeout(() => {
          this._data._querying[this.version] = false;
        }, 2500);
      } else {
        window.clearTimeout((this.CheckRequired as any).setTimeout);
        (this.CheckRequired as any).setTimeout = setTimeout(() => {
          this._data._querying[this.version] = false;
        }, 2500);
      }
    } else {
      console.log(options);
      mutate({
        variables: {
          version: "2",
          data: options
        }
      });
    }
  }
  getProductName (item) {
    this._data._productName[this.version] = item.productName;
    return item.productId;
  }
}
</script>
