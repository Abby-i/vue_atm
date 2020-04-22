<template>
  <div>
<!--    卡号验证弹框-->
    <el-dialog
      title="请输入您的卡号"
      :visible.sync="dialogVisible"
      width="30%">
      <el-input  v-model="cardNumber"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="findCard">确 定</el-button>
  </span>
    </el-dialog>
<!--    屏幕显示-->
  <el-container>
    <el-main>
      <div class="screen">
      <el-input
        type="textarea"
        :rows="13"
        placeholder="请插入您的银行卡"
        v-model="screenContent">
      </el-input>
      </div>
      <el-row>
        <el-button type="primary" @click="dialogVisible = true"  v-show="buttonDisplay">插卡</el-button>
        <el-button type="primary" @click="remove"  v-show="!buttonDisplay">拔卡</el-button>
        <el-button type="success">关机</el-button>
      </el-row>
    </el-main>
<!--    按钮组-->
    <el-aside>
      <div class="el-button-group">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
        <div class="row">
        <el-row>
          <el-button type="primary" @click="keyboard(1)"  plain :disabled="dis">1</el-button>
          <el-button type="primary" @click="keyboard(2)"  plain :disabled="dis">2</el-button>
          <el-button type="primary" @click="keyboard(3)"  plain :disabled="dis">3</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" @click="keyboard(4)"  plain :disabled="dis">4</el-button>
          <el-button type="primary" @click="keyboard(5)"  plain :disabled="dis">5</el-button>
          <el-button type="primary" @click="keyboard(6)"  plain :disabled="dis">6</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" @click="keyboard(7)"  plain :disabled="dis">7</el-button>
          <el-button type="primary" @click="keyboard(8)"  plain :disabled="dis">8</el-button>
          <el-button type="primary" @click="keyboard(9)"  plain :disabled="dis">9</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" @click="keyboard(10)"  plain :disabled="dis">确认</el-button>
          <el-button type="primary" @click="keyboard(0)"   plain :disabled="dis">0</el-button>
          <el-button type="primary" @click="keyboard(11)"  plain :disabled="dis">取消</el-button>
        </el-row>
        </div>
      </div>
      <div class="paint"> <el-button type="primary"   plain :disabled="dis">打印凭条</el-button></div>
    </el-aside>
  </el-container>
  </div>
</template>

<script>

export default {
  data(){
    return{
      dis:true,
      textarea:'',
      //卡号
      cardNumber:'',
      //密码
      cardPwd:'',
      //屏幕显示
      screenContent:'',
      //插卡/拔卡初始
      buttonDisplay:true,
      dialogVisible: false
    }
  },
  methods: {
    //验证账号
    validateAccount() {
      console.log(this.cardNumber)
      console.log(this.cardPwd)
      const query = Bmob.Query("BankCard");
      query.equalTo("cardId","==", this.cardNumber);
      query.equalTo("password","==", this.cardPwd);
      query.find().then(res => {
        console.log('验证账号' + res)
        if(res.length<0){
          //关闭弹出层
          this.$notify.error({
            title: '错误',
            message: '您输入的密码错误'
          });
          this.cardPwd=''  //清空输入框
          return;
        }
        this.$store.getters.
        this.screenContent = '选择业务\n\n1:取款\n\n2:存款\n\n3:转账\n\n4:查询明细\n\n5:查询余额\n\n6:手机充值\n\n0:退出'
      });
    },
    //按键输入（需要判断使输入密码还是业务输入）
    keyboard(key){
      let status = this.$store.getters.status
      switch (key) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          //处理密码
          if (status === 0) {
            this.screenContent += '*'
            this.cardPwd += key
          }
          break;
        case 10:
          this.validateAccount()
          break;
        case 11:
          this.cardPwd=''
          break
      }
    },

    //验证卡号是否存在
    findCard(){
      //获取输入的卡号
      const cardNumber=this.cardNumber
      //查询卡号
      const query = Bmob.Query("BankCard");
      query.equalTo("cardId","==", cardNumber);
      query.find().then(res => {
        console.log(res)
        if(res.length<1){
          //关闭弹出层
          this.$notify.error({
            title: '错误',
            message: '您输入的卡号不存在'
          });
          this.cardNumber=''
          return;
        }
        this.$notify({
          title: '成功',
          message: '验证成功，请输入密码',
          type: 'success'
        });
        this.screenContent='请输入您的密码:'
        //TODO:卡号存在更新状态
        this.dis=false
        //登录后插/拔卡状态
        this.buttonDisplay=false
        //弹框状态
        this.dialogVisible = false
      });
    },
    remove(){
      this.$confirm('此操作将拔出银行卡, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '拔卡成功!',
        });
          this.buttonDisplay=true,
          this.dis=true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消拔卡'
        });
      });
    },
  }
}
</script>

<style>

</style>
