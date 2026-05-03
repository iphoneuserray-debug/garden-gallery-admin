import { Link, useNavigate } from "react-router"
import { ArrowLeftRightIcon, LayoutDashboardIcon, LogOutIcon, MapPinIcon, PackageIcon, ShoppingCartIcon, TagIcon, UsersIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "仪表盘", url: "/", icon: LayoutDashboardIcon },
  { title: "订单", url: "/orders", icon: ShoppingCartIcon },
  { title: "交易", url: "/transactions", icon: ArrowLeftRightIcon },
  { title: "客户", url: "/customers", icon: UsersIcon },
  { title: "商品", url: "/products", icon: PackageIcon },
  { title: "取货点", url: "/pickup-locations", icon: MapPinIcon },
  { title: "优惠券", url: "/coupons", icon: TagIcon },
]

export function AppSidebar({ ...props }) {
  const navigate = useNavigate()

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Garden Gallery</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/login")} className="text-muted-foreground hover:text-destructive">
              <LogOutIcon />
              <span>退出登录</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
