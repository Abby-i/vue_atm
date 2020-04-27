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
        readonly="readonly"
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
      <div class="paint"> <el-button type="primary"   plain  @click="paint">打印凭条</el-button></div>
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
      //指定业务的变量
      businessChoice:'',//选择业务1:取款2:存款3:转账4:查询明细5:查询余额6:手机充值0:退出
      //取款金额
      drawNumber:'',
      //存入金额
      depositNumber:'',
      //
      depositFlag: 0,
      //收款人
     payeeId:'',
      //是否可以打印凭条
      printAvailableFlag: false,
      //弹框取消按钮初始值
      dialogVisible: false
    }
  },
  methods: {
    //1.验证卡号是否存在（若存在则输入密码点击确认 进入到确认方法validateAccount()）
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

    //2.若卡号存在，则输入密码并判断
    validateAccount() {
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
        this.screenContent = '选择业务\n1:取款\n2:存款\n3:转账\n4:查询明细\n5:查询余额\n6:手机充值\n0:退出'
        //更新当前操作状态
        this.$store.commit('STATUS',1)//状态为1是登录成功待选择业务
      });
    },

    //3.按键输入存在两种情况（需要判断使输入密码还是业务输入）
    keyboard: function (key) {
      let status = this.$store.getters.status
      switch (key) {
        case 0://0:退出
        case 1://1:取款
        case 2://2:存款
        case 3://3:转账
        case 4://4:查询明细
        case 5://5:查询余额
        case 6://6:手机充值
        case 7:
        case 8:
        case 9:
          //(1)处理密码
          if (status === 0) {
            this.screenContent += '*'
            this.cardPwd += key
          }

          //(2)判断选择的业务（包括用户选择业务以及用户key输入）
          if (status === 1) {
            //正在选择key指定的业务
            if (key === 0) {
              //0退出
              this.exit()
            }
            if (key === 1) {
              //1取款
              this.$store.commit('STATUS', 2)//状态２为取款
              this.screenContent = '请输入取款金额：'
            }
            if (key === 2) {
              //2存款
              this.$store.commit('STATUS', 3)//状态3为存款
              this.screenContent = '存入金额为：'
            }
            if (key === 3) {
              //3转账
              this.$store.commit('STATUS', 4)//状态4为转账,输入账号
              this.screenContent = '请输入收款人卡号：'
            }
            if (key === 4) {
              //4.查询交易明细
              this.query()
            }
            if(key === 5){
              //5.查询账户余额
              this.queryBalance()
            }
            if(key === 6){
              //6.手机充值
              this.$store.commit('STATUS', 6)//状态4为转账,输入账号
              this.screenContent = '请输入电话号码：'
            }
          }

          //(2.1)通过status判断为选择业务还是输入key值
          if (status === 2) {
            //接收取款金额
            this.screenContent += key
            this.drawNumber += key
          }
          if (status === 3) {
            //接收取款金额
            this.screenContent += key
            this.depositNumber += key
          }
          if (status === 4) {
            //接收收款人卡号
            this.screenContent += key
            this.payeeId += key
          }
          if (status === 5) {
            //转账金额
            this.screenContent += key
            this.drawNumber += key
          }
          if (status === 6) {
            //接收电话号码
            this.screenContent += key
            this.payeeId += key
          }
          if (status === 7) {
            //充值金额
            this.screenContent += key
            this.drawNumber += key
          }
          break;
        //确认按钮
        case 10:
          if (status === 0) {
            //验证用户输入密码时点击确认所执行的方法
            this.validateAccount()
          }
          if (status === 1) {//确认选择业务

          }
          //输入取款金额点击确定按钮时 对应的方法
          if (status === 2 && this.drawNumber != '') {
            this.withdrawal() //取款
          }
          if (status === 3 && this.depositNumber != '') {
            console.log('存款方法入口')
            this.deposit()//存款
          }
          if (status === 4 && this.payeeId != '') {
            this.$store.commit('STATUS', 5)
            this.screenContent = '请输入转账金额：'
          }
          if (status === 5 && this.drawNumber != '') {
            this.transfer()//转账
          }
          if (status === 4 && this.payeeId != '') {
            this.$store.commit('STATUS', 5)
            this.screenContent = '请输入转账金额：'
          }
          if (status === 6 && this.payeeId != '') {
            this.$store.commit('STATUS', 7)
            this.screenContent = '请输入充值金额：'
          }
          if (status === 7 && this.drawNumber != '') {
            this.recharge()//转账
          }

          if (status === 100) {
            this.depositNumber = ''
            this.$store.commit('STATUS', 1)
            this.screenContent = '选择业务\n1:取款\n2:存款\n3:转账\n4:查询明细\n5:查询余额\n6:手机充值\n0:退出'
            this.textarea=''
            console.log('执行业务显示')
          }
          break;
        case 11:
          if(status === 0){
            this.screenContent='请输入您的密码：'
            this.cardPwd = ''
          }else{
            this.screenContent = '选择业务\n1:取款\n2:存款\n3:转账\n4:查询明细\n5:查询余额\n6:手机充值\n0:退出'
            this.$store.commit('STATUS',1)
          }
          break
        default:
          break;
      }
    },
    //退出
    exit(){
      //清除操作存储的状态
      this.$store.commit('STATUS',1)
      //更新屏幕显示的值
      this.screenContent = '选择业务\n1:取款\n2:存款\n3:转账\n4:查询明细\n5:查询余额\n6:手机充值\n0:退出'
    },
    //取款
    withdrawal(){
      //查询余额是否满足取款数目
      const query = Bmob.Query("BankCard");
      query.equalTo("cardId","==", this.cardNumber);
      query.find().then(resp => {
        if(resp[0].balance >= Number(this.drawNumber)){
          const query = Bmob.Query('BankCard');
          query.get(resp[0].objectId).then(res => {
            res.set('balance',resp[0].balance -  Number(this.drawNumber))
            res.save()
          }).catch(err => {
            console.log(err)
          })
          this.screenContent = "取款成功"
          this.addDetail(1)
        }else{
          this.screenContent = '余额不足'
        }
        //更新当前操作状态
        this.$store.commit('STATUS',100)
        //状态为1是登录成功待选择业务
      });
      this.printAvailableFlag=true
    },

    //存款
    deposit(){
      const query = Bmob.Query('BankCard');
      query.equalTo("cardId","==", this.cardNumber);
      query.find().then(resp =>{
        //if(resp.length > 0){
          query.get(resp[0].objectId).then(res => {
            //console.log(res)
            res.set('balance',resp[0].balance + Number(this.depositNumber))
            res.save()
            console.log('调用存款方法')
          }).catch(err => {
            console.log(err)
            this.screenContent='存款失败，按确认键退出'
          })
        this.screenContent='存款成功，按确认键退出'
        this.addDetail(0)
        this.$store.commit('STATUS',100)
        this.depositNumber = ''
        //}else {
        })
        //更新当前操作状态
        //this.$store.commit('STATUS',1)//状态为1是登录成功待选择业务
      this.printAvailableFlag=true
    },

    //转账.扣除转账金额
    transfer(){
      const query = Bmob.Query("BankCard");
      query.equalTo("cardId","==", this.cardNumber);
      query.find().then(resp => {
        if(resp[0].balance >= Number(this.drawNumber)){
          const query = Bmob.Query('BankCard');
          //发送方减少drawNumber
          query.get(resp[0].objectId).then(res => {
            res.set('balance',resp[0].balance -  Number(this.drawNumber))
            res.save()
          }).catch(err => {
            console.log(err)
          })
          //接收方增加drawNumber
          //自己写
          this.transferMoney()
          this.screenContent = "转账成功，按确认键返回"
          this.addDetail(1)
        }else{
          this.screenContent = '余额不足，按确认键返回'
        }
        //更新当前操作状态
        this.$store.commit('STATUS',100)//状态为1是登录成功待选择业务
        this.printAvailableFlag=true
      });
    },
    //转账.获取转账金额
    transferMoney(){
      const query = Bmob.Query('BankCard');
      query.equalTo("cardId","==", this.payeeId);
      query.find().then(resp =>{
        if(resp.length > 0){
          query.get(resp[0].objectId).then(res => {
            console.log(res)
            res.set('balance',resp[0].balance + Number(this.drawNumber))
            res.save()
          }).catch(err => {
            console.log(err)
          })
        }else {
          this.screenContent = '卡号不存在，按确认键返回'
        }
        //更新当前操作状态
        this.addDetail(0)
        this.$store.commit('STATUS',100)//状态为1是登录成功待选择业务
      })
    },

    //添加明细
    addDetail(type){
      const query = Bmob.Query('Transaction');
      query.set("cardId",this.cardNumber)
      query.set("payeeId",this.payeeId)
      console.log("操作者"+this.cardNumber)
      console.log("收款人"+this.payeeId)
      query.set("amount",type ===0 ? this.depositNumber : this.drawNumber)
      query.set("type",type === 0 ? '收入': '支出')
      query.save().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },

     //查询明细
    query(){
      var detail = '卡号\t交易类型\t交易金额\t收款人\t\t交易时间\n'
      const query = Bmob.Query('Transaction');
      query.equalTo("cardId","==", this.cardNumber);
      query.find().then(resp =>{
        if(resp.length > 0){
          resp.forEach(v => {
            detail += `${v.cardId}\t${v.type}\t\t${v.amount}\t\t${v.payeeId}\t\t${v.createdAt.substring(0, 10)}\n`
          })
          this.screenContent = detail
        }else {
          this.screenContent = '没有交易记录，按确认键返回'
        }
        //更新当前操作状态
        this.$store.commit('STATUS',100)//状态为1是登录成功待选择业务
      })
    },

    //查询余额
    queryBalance(){
      const query = Bmob.Query('BankCard');
      query.equalTo("cardId","==", this.cardNumber);
      query.find().then(resp =>{
        this.screenContent ='当前账户余额：'+ resp[0].balance
        //更新当前操作状态
        this.$store.commit('STATUS',100)//状态为1是登录成功待选择业务
      })
    },

    //话费充值
    recharge(){
      //查询余额是否满足取款数目
      const query = Bmob.Query("BankCard");
      query.equalTo("cardId","==", this.cardNumber);
      query.find().then(resp => {
        if(resp[0].balance >= Number(this.drawNumber)){
          const query = Bmob.Query('BankCard');
          query.get(resp[0].objectId).then(res => {
            res.set('balance',resp[0].balance -  Number(this.drawNumber))
            res.save()
          }).catch(err => {
            console.log(err)
          })
          this.screenContent = "充值成功，按确认键返回"
          this.addDetail(1)
        }else{
          this.screenContent = '余额不足'
        }
        //更新当前操作状态
        this.$store.commit('STATUS',100)
        //状态为1是登录成功待选择业务
        this.printAvailableFlag=true
      });
    },

    //打印凭条
    paint(){
      //如果当前状态是存款、取款、转账、充值则给予打印
      if(this.printAvailableFlag){
        //查出最新的记录
        const query = Bmob.Query("Transaction");
        query.equalTo("cardId","==", this.cardNumber);
        query.order("-createdAt");
        query.find().then(resp => {

          this.textarea = '流水号:'+resp[0].objectId +'\n'+ '卡号:'+resp[0].cardId+'\n'+ '交易类型:'+resp[0].type +'\n'+ '交易金额:'+resp[0].amount+'\n'+ '交易时间:'+resp[0].createdAt

        });
      }else{
        this.screenContent='您当前未办理任何业务，按确认键退出'
      }
      this.$store.commit('STATUS',100)
    },

    //拔出银行卡的方法
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
          this.cardNumber=''
          this.buttonDisplay=true,
          this.dis=true
        this.screenContent="请插入您的银行卡"
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
