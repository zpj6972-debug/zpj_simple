import { ref, h } from "vue";
import type { FormItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import forms from "../form.vue";
import { message } from "@/utils/message";
export function useWelcome() {
  const formRef = ref();

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}`,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          user: row?.user ?? "",
          region: row?.region ?? null
        }
      },
      contentRenderer: () => h(forms, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value?.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`21321`, {
            type: "success"
          });
          done(); // 关闭弹框
          // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }
  return {
    openDialog
  };
}
